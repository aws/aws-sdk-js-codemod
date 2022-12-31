import { JSCodeshift } from "jscodeshift";

import { V3ClientImportSpecifierOptions } from "./types";

export const getV3ClientImportSpecifier = (
  j: JSCodeshift,
  { importedName, localName }: V3ClientImportSpecifierOptions
) =>
  importedName === localName
    ? j.importSpecifier(j.identifier(importedName))
    : j.importSpecifier(j.identifier(importedName), j.identifier(localName));
