import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportEqualsIdentifierNameOptions {
  localName: string;
  sourceValue: string;
}

export const removeImportEqualsIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveImportEqualsIdentifierNameOptions
) => {
  source
    .find(j.TSImportEqualsDeclaration, {
      type: "TSImportEqualsDeclaration",
      id: { name: localName },
      moduleReference: {
        type: "TSExternalModuleReference",
        expression: { type: "StringLiteral", value: sourceValue },
      },
    })
    .remove();
};
