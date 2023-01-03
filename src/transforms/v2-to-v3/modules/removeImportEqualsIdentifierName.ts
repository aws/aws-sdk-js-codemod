import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportEqualsIdentifierNameOptions {
  identifierName: string;
  expressionValue: string;
}

export const removeImportEqualsIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, expressionValue }: RemoveImportEqualsIdentifierNameOptions
) => {
  source
    .find(j.TSImportEqualsDeclaration, {
      type: "TSImportEqualsDeclaration",
      id: { name: identifierName },
      moduleReference: {
        type: "TSExternalModuleReference",
        expression: { type: "StringLiteral", value: expressionValue },
      },
    })
    .remove();
};
