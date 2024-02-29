import { Collection, JSCodeshift } from "jscodeshift";
import { PACKAGE_NAME } from "../../config";
import { ImportSpecifierType } from "../types";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  source
    .find(j.ImportDeclaration)
    .filter((importDeclaration) => {
      const sourceValue = importDeclaration.value.source.value;
      if (typeof sourceValue !== "string") {
        return false;
      }
      if (path) {
        return sourceValue === path;
      }
      return sourceValue.startsWith(PACKAGE_NAME);
    })
    .forEach((importDeclaration) => {
      const specifiers = importDeclaration.value.specifiers || [];
      for (const specifier of specifiers) {
        switch (specifier.type) {
          case "ImportSpecifier": {
            const importedName = specifier.imported.name;
            importSpecifiers.add({
              importedName,
              localName: specifier.local!.name || importedName,
            });
            break;
          }
          case "ImportNamespaceSpecifier":
          case "ImportDefaultSpecifier": {
            if (specifier.local) {
              importSpecifiers.add(specifier.local.name);
            }
            break;
          }
        }
      }
    });

  return Array.from(importSpecifiers);
};
