import { Collection, JSCodeshift } from "jscodeshift";

export const hasImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.TSImportEqualsDeclaration, {
      type: "TSImportEqualsDeclaration",
      moduleReference: {
        type: "TSExternalModuleReference",
        expression: { type: "StringLiteral" },
      },
    })
    .size() > 0;
