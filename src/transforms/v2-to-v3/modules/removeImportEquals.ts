import { Collection, JSCodeshift } from "jscodeshift";
import { removeImportDeclaration } from "./removeImportDeclaration";

export interface RemoveImportEqualsOptions {
  localName: string;
  sourceValue: string;
}

export const removeImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveImportEqualsOptions
) => {
  const importEqualsDeclaration = source.find(j.TSImportEqualsDeclaration, {
    type: "TSImportEqualsDeclaration",
    id: { name: localName },
    moduleReference: {
      type: "TSExternalModuleReference",
      expression: { type: "StringLiteral", value: sourceValue },
    },
  });
  if (importEqualsDeclaration.length) {
    removeImportDeclaration(j, importEqualsDeclaration.get());
  }
};
