import { JSCodeshift } from "jscodeshift";

import { V3ClientImportSpecifierOptions } from "./types";

export const getV3ClientImportSpecifier = (
  j: JSCodeshift,
  { importedName, localName }: V3ClientImportSpecifierOptions
) =>
  localName
    ? j.importSpecifier(j.identifier(importedName), j.identifier(localName))
    : j.importSpecifier(j.identifier(importedName));
