import type { Collection, JSCodeshift } from "jscodeshift";
import type { ImportSpecifierType } from "../types";
import { getImportDeclarations } from "./getImportDeclarations";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  getImportDeclarations(j, source, path).forEach((importDeclaration) => {
    const specifiers = importDeclaration.value.specifiers || [];
    for (const specifier of specifiers) {
      switch (specifier.type) {
        case "ImportSpecifier": {
          const importedName = specifier.imported.name as string;
          importSpecifiers.add({
            importedName,
            localName: (specifier.local?.name as string) || importedName,
          });
          break;
        }
        case "ImportNamespaceSpecifier":
        case "ImportDefaultSpecifier": {
          if (specifier.local) {
            importSpecifiers.add({ localName: specifier.local.name as string });
          }
          break;
        }
      }
    }
  });

  return Array.from(importSpecifiers);
};
