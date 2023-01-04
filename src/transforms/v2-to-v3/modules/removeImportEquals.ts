import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportEqualsOptions {
  localName: string;
  sourceValue: string;
}

export const removeImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveImportEqualsOptions
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
