import { readFile } from "fs/promises";
import { join } from "path";
import jscodeshift, {
  Identifier,
  TSArrayType,
  TSFunctionType,
  TSQualifiedName,
  TSTypeLiteral,
  TSTypeReference,
} from "jscodeshift";

import { DOCUMENT_CLIENT } from "../../src/transforms/v2-to-v3/config";
import { getClientTypesMapWithKeysRemovedFromValues } from "./getClientTypesMapWithKeysRemovedFromValues";

const TYPES_TO_SKIP = ["apiVersion", "ClientConfiguration"];
const ElementTypeToNativeTypeMap = {
  TSAnyKeyword: "any",
  TSStringKeyword: "string",
  TSNumberKeyword: "number",
  TSBooleanKeyword: "boolean",
};

export const getClientTypesMap = async (clientName: string): Promise<Record<string, string>> => {
  const clientTypesMap = {};

  const typesPath =
    clientName === DOCUMENT_CLIENT
      ? join("node_modules", "aws-sdk", "lib", "dynamodb", `document_client.d.ts`)
      : join("node_modules", "aws-sdk", "clients", `${clientName.toLowerCase()}.d.ts`);
  const relativeTypesPath = join(__dirname, "..", "..", typesPath);

  const typesCode = await readFile(relativeTypesPath, "utf8");

  const j = jscodeshift.withParser("ts");
  const source = j(typesCode);

  source.find(j.TSModuleDeclaration, { id: { name: clientName } }).forEach((moduleDeclaration) => {
    const tsTypes = j(moduleDeclaration).find(j.TSTypeAliasDeclaration).nodes();

    for (const [type, value] of Object.entries(ElementTypeToNativeTypeMap)) {
      tsTypes
        .filter((tsType) => tsType.typeAnnotation.type === type)
        .forEach((tsType) => {
          clientTypesMap[tsType.id.name] = value;
        });
    }

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSTypeReference")
      .forEach((tsType) => {
        const name = tsType.id.name;
        const typeName = ((tsType.typeAnnotation as TSTypeReference).typeName as Identifier).name;
        if (typeName === "Date") {
          clientTypesMap[name] = typeName;
        } else if (typeName === "EventStream") {
          // Exception for SelectObjectContentEventStream
          clientTypesMap[name] = "AsyncIterable<KEY>";
        } else {
          console.log("TSTypeReference with unsupported type:", name, typeName);
        }
      });

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSUnionType")
      .forEach((tsType) => {
        const name = tsType.id.name;
        if (name.endsWith("Blob")) {
          clientTypesMap[name] = "Uint8Array";
        }
      });

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSArrayType")
      .forEach((tsType) => {
        const name = tsType.id.name;
        const elementType = (tsType.typeAnnotation as TSArrayType).elementType;
        if (elementType.type === "TSTypeReference") {
          const typeName = elementType.typeName;
          if (typeName.type === "Identifier") {
            if (clientTypesMap[typeName.name]) {
              clientTypesMap[name] = `Array<${clientTypesMap[typeName.name]}>`;
            } else {
              // Assume it's an interface which would be available in v3.
              clientTypesMap[name] = `Array<${typeName.name}>`;
            }
          } else {
            console.log("TSArrayType TSTypeReference without Identifier type:", name);
          }
        } else if (Object.keys(ElementTypeToNativeTypeMap).includes(elementType.type)) {
          clientTypesMap[name] = `Array<${ElementTypeToNativeTypeMap[elementType.type]}>`;
        } else {
          console.log("TSArrayType with unsupported elemental type:", name);
        }
      });

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSTypeLiteral")
      .forEach((tsType) => {
        const name = tsType.id.name;
        const member = (tsType.typeAnnotation as TSTypeLiteral).members[0];
        if (member.type === "TSIndexSignature") {
          if (member.typeAnnotation) {
            if (member.typeAnnotation.typeAnnotation) {
              const typeAnnotation = member.typeAnnotation.typeAnnotation;
              if (typeAnnotation.type === "TSTypeReference") {
                const typeName = typeAnnotation.typeName;
                if (typeName.type === "Identifier") {
                  if (clientTypesMap[typeName.name]) {
                    clientTypesMap[name] = `Record<string, ${clientTypesMap[typeName.name]}>`;
                  } else {
                    // Assume it's an interface which would be available in v3.
                    clientTypesMap[name] = `Record<string, ${typeName.name}>`;
                  }
                } else {
                  console.log("TSTypeLiteral TSTypeReference without Identifier type:", name);
                }
              } else if (Object.keys(ElementTypeToNativeTypeMap).includes(typeAnnotation.type)) {
                clientTypesMap[name] = `Record<string, ${
                  ElementTypeToNativeTypeMap[typeAnnotation.type]
                }>`;
              } else {
                console.log("TSTypeLiteral with unsupported typeAnnotation type:", name);
              }
            }
          }
        }
      });

    tsTypes.forEach((tsType) => {
      const name = tsType.id.name;
      const type = tsType.typeAnnotation.type;
      if (!TYPES_TO_SKIP.includes(name) && !clientTypesMap[name] && type !== "TSUnionType") {
        console.log("Unsupported type:", name);
      }
    });
  });

  source.find(j.ClassDeclaration, { id: { name: clientName } }).forEach((classDeclaration) => {
    const classMethods = j(classDeclaration).find(j.TSDeclareMethod).nodes();

    classMethods.forEach((classMethod) => {
      if (classMethod.key.type !== "Identifier") return;
      if (classMethod.key.name === "constructor") return;
      if (classMethod.key.name.startsWith("waitFor")) return;

      const classMethodKeyName = (classMethod.key as Identifier).name;
      const commandName = classMethodKeyName.charAt(0).toUpperCase() + classMethodKeyName.slice(1);

      if (classMethod.params.length !== 2) return;
      if (classMethod.params[0].type !== "Identifier") return;
      if (classMethod.params[0].name !== "params") return;

      const params = classMethod.params[0] as Identifier;

      if (!params.typeAnnotation) return;
      if (!params.typeAnnotation.typeAnnotation) return;
      if (params.typeAnnotation.typeAnnotation.type !== "TSTypeReference") return;
      const paramsTypeRef = params.typeAnnotation!.typeAnnotation! as TSTypeReference;

      if (!paramsTypeRef.typeName) return;
      if (paramsTypeRef.typeName.type !== "TSQualifiedName") return;
      const paramsTypeRefName = paramsTypeRef.typeName as TSQualifiedName;

      if (!paramsTypeRefName.right) return;
      if (paramsTypeRefName.right.type !== "Identifier") return;
      const paramsTypeName = paramsTypeRefName.right as Identifier;
      const requestTypeName = paramsTypeName.name;

      clientTypesMap[requestTypeName] = `${commandName}CommandInput`;

      if (classMethod.params[1].type !== "Identifier") return;
      if (classMethod.params[1].name !== "callback") return;
      const callback = classMethod.params[1] as Identifier;

      if (!callback.typeAnnotation) return;
      if (!callback.typeAnnotation.typeAnnotation) return;
      if (callback.typeAnnotation.typeAnnotation.type !== "TSFunctionType") return;
      const callbackTypeRef = callback.typeAnnotation!.typeAnnotation! as TSFunctionType;

      if (!callbackTypeRef.parameters) return;
      if (callbackTypeRef.parameters.length !== 2) return;
      if (callbackTypeRef.parameters[1].type !== "Identifier") return;
      const responseType = callbackTypeRef.parameters[1] as Identifier;

      if (!responseType.typeAnnotation) return;
      if (responseType.typeAnnotation.type !== "TSTypeAnnotation") return;
      if (!responseType.typeAnnotation.typeAnnotation) return;
      if (responseType.typeAnnotation.typeAnnotation.type !== "TSTypeReference") return;
      const responseTypeRef = responseType.typeAnnotation!.typeAnnotation! as TSTypeReference;

      if (!responseTypeRef.typeName) return;
      if (responseTypeRef.typeName.type !== "TSQualifiedName") return;
      const responseTypeRefName = responseTypeRef.typeName as TSQualifiedName;

      if (!responseTypeRefName.right) return;
      if (responseTypeRefName.right.type !== "Identifier") return;
      const responseTypeName = (responseTypeRefName.right as Identifier).name;

      clientTypesMap[responseTypeName] = `${commandName}CommandOutput`;
    });
  });

  const updatedClientTypesMap = getClientTypesMapWithKeysRemovedFromValues(clientTypesMap);

  return Object.entries(updatedClientTypesMap)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
