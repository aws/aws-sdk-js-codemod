import { Collection, JSCodeshift, ObjectProperty, Property } from "jscodeshift";
import { OBJECT_PROPERTY_TYPE_LIST } from "../../config";
import { ImportSpecifierType } from "../types";
import { getRequireDeclarators } from "./getRequireDeclarators";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  for (const varDeclarator of getRequireDeclarators(j, source, path).nodes()) {
    const declaratorId = varDeclarator.id;

    if (declaratorId.type === "Identifier") {
      const declaratorIdName = declaratorId.name;
      importSpecifiers.add(declaratorIdName);
    }

    if (declaratorId.type === "ObjectPattern") {
      const properties = declaratorId.properties;
      for (const property of properties) {
        if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
          continue;
        }
        const objectProperty = property as Property | ObjectProperty;
        const key = objectProperty.key;
        const value = objectProperty.value;
        if (key.type === "Identifier" && value.type === "Identifier") {
          importSpecifiers.add({
            importedName: key.name,
            localName: value.name,
          });
        }
      }
    }
  }

  return Array.from(importSpecifiers);
};
