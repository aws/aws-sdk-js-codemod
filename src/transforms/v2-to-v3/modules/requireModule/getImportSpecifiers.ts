import {
  CallExpression,
  Collection,
  JSCodeshift,
  Literal,
  ObjectProperty,
  Property,
} from "jscodeshift";
import { OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME } from "../../config";
import { ImportSpecifierType } from "../types";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  const varDeclarators = source
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
      },
    })
    .nodes()
    .filter((varDeclarator) => {
      const declaratorInit = varDeclarator.init;
      if (!declaratorInit || declaratorInit.type !== "CallExpression") {
        return false;
      }

      const callExpression = declaratorInit as CallExpression;
      if (callExpression.arguments.length !== 1) {
        return false;
      }

      const { value: sourceValue } = callExpression.arguments[0] as Literal;
      if (typeof sourceValue !== "string") {
        return false;
      }

      if (path) {
        return sourceValue === path;
      } else {
        return sourceValue.startsWith(PACKAGE_NAME);
      }
    });

  for (const varDeclarator of varDeclarators) {
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
