import jscodeshift from "jscodeshift";

import { CLIENT_NAMES_MAP, DOCUMENT_CLIENT } from "../../src/transforms/v2-to-v3/config/index.ts";
import { getClientTypesMapWithKeysRemovedFromValues } from "./getClientTypesMapWithKeysRemovedFromValues/index.ts";
import { getTypesSource } from "./getTypesSource/index.ts";

const TYPES_TO_SKIP = ["apiVersion", "ClientConfiguration"];
const ElementTypeToNativeTypeMap = {
  TSAnyKeyword: "any",
  TSStringKeyword: "string",
  TSNumberKeyword: "number",
  TSBooleanKeyword: "boolean",
};

export const getClientTypesMap = async (clientName: string): Promise<Record<string, string>> => {
  const clientTypesMap = {};

  const j = jscodeshift.withParser("ts");
  const source = getTypesSource(j, clientName);

  source.find(j.TSModuleDeclaration, { id: { name: clientName } }).forEach((moduleDeclaration) => {
    const tsTypes = j(moduleDeclaration).find(j.TSTypeAliasDeclaration).nodes();

    for (const [type, value] of Object.entries(ElementTypeToNativeTypeMap)) {
      tsTypes
        .filter((tsType) => tsType.typeAnnotation.type === type)
        .forEach((tsType) => {
          const { name } = tsType.id;
          if (clientName === DOCUMENT_CLIENT && name === "AttributeValue" && value === "any") {
            clientTypesMap[name] = "NativeAttributeValue";
          } else {
            clientTypesMap[name] = value;
          }
        });
    }

    tsTypes.forEach((tsType) => {
      if (tsType.typeAnnotation.type !== "TSTypeReference") return;
      const typeAnnotationName = tsType.typeAnnotation.typeName;
      if (typeAnnotationName.type !== "Identifier") return;
      const name = tsType.id.name;
      const typeName = typeAnnotationName.name;
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

    tsTypes.forEach((tsType) => {
      if (tsType.typeAnnotation.type !== "TSArrayType") return;
      const name = tsType.id.name;
      const elementType = tsType.typeAnnotation.elementType;
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

    tsTypes.forEach((tsType) => {
      if (tsType.typeAnnotation.type !== "TSTypeLiteral") return;
      const name = tsType.id.name;
      const member = tsType.typeAnnotation.members[0];
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

  const updatedClientTypesMap = getClientTypesMapWithKeysRemovedFromValues(clientTypesMap);
  // biome-ignore lint/complexity/useLiteralKeys: script
  clientTypesMap["ClientConfiguration"] = `${CLIENT_NAMES_MAP[clientName]}ClientConfig`;

  return Object.entries(updatedClientTypesMap)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
