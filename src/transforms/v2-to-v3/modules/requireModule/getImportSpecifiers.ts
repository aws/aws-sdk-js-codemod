import type { Collection, JSCodeshift } from "jscodeshift";
import type { ImportSpecifierType } from "../types.ts";
import { getRequireDeclarators } from "./getRequireDeclarators.ts";

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
      if (
        declaratorInit?.type === "MemberExpression" &&
        declaratorInit.property.type === "Identifier"
      ) {
        importSpecifiers.add({
          importedName: declaratorInit.property.name,
          localName: declaratorIdName,
        });
      } else {
        importSpecifiers.add({ localName: declaratorIdName });
      }
    }

    if (declaratorId.type === "ObjectPattern") {
      if (declaratorInit?.type !== "CallExpression") {
        continue;
      }
      for (const property of declaratorId.properties) {
        if (property.type !== "Property" && property.type !== "ObjectProperty") {
          continue;
        }
        if (property.key.type === "Identifier" && property.value.type === "Identifier") {
          importSpecifiers.add({
            importedName: property.key.name,
            localName: property.value.name,
          });
        }
      }
    }
  }

  return Array.from(importSpecifiers);
};
