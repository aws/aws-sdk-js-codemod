import type { Collection, JSCodeshift, TSExternalModuleReference } from "jscodeshift";
import { PACKAGE_NAME } from "../../config/index.ts";

export const getImportEqualsDeclarations = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
) =>
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
      const expressionValue = moduleReference.expression.value;
      if (path) {
        return expressionValue === path;
      }
      return expressionValue.startsWith(PACKAGE_NAME);
    });
