import { Collection, Identifier, JSCodeshift, ObjectProperty, Property } from "jscodeshift";
import { OBJECT_PROPERTY_TYPE_LIST } from "../../config";
import { ImportSpecifierType } from "../types";
import { getRequireDeclarators } from "./getRequireDeclarators";

const getImportSpecifiersFromObjectPattern = (properties: (Property | ObjectProperty)[]) => {
  const importSpecifiers = new Set<ImportSpecifierType>();

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

  return Array.from(importSpecifiers);
};

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  for (const varDeclarator of getRequireDeclarators(j, source, path).nodes()) {
    const declaratorId = varDeclarator.id;
    const declaratorInit = varDeclarator.init;

    if (declaratorId.type === "Identifier") {
      const declaratorIdName = declaratorId.name;
      if (declaratorInit!.type === "MemberExpression") {
        importSpecifiers.add({
          importedName: (declaratorInit.property as Identifier).name,
          localName: declaratorIdName,
        });
      } else {
        importSpecifiers.add({ localName: declaratorIdName });
      }
    }

    if (declaratorId.type === "ObjectPattern") {
      if (declaratorInit!.type !== "CallExpression") {
        continue;
      }
      const properties = declaratorId.properties as (Property | ObjectProperty)[];
      for (const importSpecifier of getImportSpecifiersFromObjectPattern(properties)) {
        importSpecifiers.add(importSpecifier);
      }
    }
  }

  return Array.from(importSpecifiers);
};
