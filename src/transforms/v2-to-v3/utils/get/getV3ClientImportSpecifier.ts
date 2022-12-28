import { JSCodeshift } from "jscodeshift";

export interface V3ClientImportSpecifierOptions {
  importedName: string;
  localName: string;
}

export const getV3ClientImportSpecifier = (
  j: JSCodeshift,
  { importedName, localName }: V3ClientImportSpecifierOptions
) =>
  importedName === localName
    ? j.importSpecifier(j.identifier(importedName))
    : j.importSpecifier(j.identifier(importedName), j.identifier(localName));
