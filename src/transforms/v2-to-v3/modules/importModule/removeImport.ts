import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportOptions {
  importedName?: string;
  localName: string;
  sourceValue: string;
}

export const removeImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { importedName, localName, sourceValue }: RemoveImportOptions
) => {};
