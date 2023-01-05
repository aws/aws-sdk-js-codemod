import { readFile } from "fs/promises";
import jscodeshift, { Identifier, TSArrayType, TSTypeLiteral, TSTypeReference } from "jscodeshift";
import { join } from "path";

const TYPES_TO_SKIP = ["apiVersion", "ClientConfiguration"];
const ElementTypeToNativeTypeMap = {
  TSStringKeyword: "string",
  TSNumberKeyword: "number",
  TSBooleanKeyword: "boolean",
};

export const getClientTypeMap = async (clientName: string): Promise<Record<string, string>> => {
  const clientTypesMap = {};

  const typesPath = join("node_modules", "aws-sdk", "clients", `${clientName.toLowerCase()}.d.ts`);
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
      if (!TYPES_TO_SKIP.includes(name) && !clientTypesMap[name]) {
        console.log("Unsupported type:", name);
      }
    });
  });

  return Object.entries(clientTypesMap)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
