import { Collection, JSCodeshift, StringLiteral, TSExternalModuleReference } from "jscodeshift";
import { PACKAGE_NAME } from "../../config";
import { ImportSpecifierType } from "../types";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  source
    .find(j.TSImportEqualsDeclaration, {
      type: "TSImportEqualsDeclaration",
      moduleReference: {
        type: "TSExternalModuleReference",
        expression: { type: "StringLiteral" },
      },
    })
    .filter((importEqualsDeclaration) => {
      const moduleReference = importEqualsDeclaration.value
        .moduleReference as TSExternalModuleReference;
      const expressionValue = (moduleReference.expression as StringLiteral).value;
      if (path) {
        return expressionValue === path;
      }
      return expressionValue.startsWith(PACKAGE_NAME);
    })
    .forEach((importEqualsDeclaration) => {
      importSpecifiers.add({ localName: importEqualsDeclaration.value.id.name });
    });

  return Array.from(importSpecifiers);
};
