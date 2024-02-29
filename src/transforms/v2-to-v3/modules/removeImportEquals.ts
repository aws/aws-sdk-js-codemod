import { Collection, JSCodeshift } from "jscodeshift";
import { getImportEqualsDeclarations } from "./importEqualsModule";
import { removeDeclaration } from "./removeDeclaration";

export interface RemoveImportEqualsOptions {
  localName: string;
  sourceValue: string;
}

export const removeImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveImportEqualsOptions
) => {
  const importEqualsDeclaration = getImportEqualsDeclarations(j, source, sourceValue).filter(
    (importEqualsDeclaration) => importEqualsDeclaration.value.id.name === localName
  );
  if (importEqualsDeclaration.length) {
    removeDeclaration(j, source, importEqualsDeclaration.get());
  }
};
