import type { Collection, JSCodeshift } from "jscodeshift";
import type { ImportSpecifierType } from "../types.ts";
import { getImportDeclarations } from "./getImportDeclarations.ts";

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
          const importedName = specifier.imported.name;
          const localName = specifier.local?.name;
          if (typeof importedName !== "string" || (localName && typeof localName !== "string")) {
            throw new Error(
              "Please report your use case on https://github.com/aws/aws-sdk-js-codemod"
            );
          }
          importSpecifiers.add({
            importedName,
            localName: localName || importedName,
          });
          break;
        }
        case "ImportNamespaceSpecifier":
        case "ImportDefaultSpecifier": {
          if (specifier.local) {
            const localName = specifier.local.name;
            if (typeof localName !== "string") {
              throw new Error(
                "Please report your use case on https://github.com/aws/aws-sdk-js-codemod"
              );
            }
            importSpecifiers.add({ localName });
          }
          break;
        }
      }
    }
  });

  return Array.from(importSpecifiers);
};
