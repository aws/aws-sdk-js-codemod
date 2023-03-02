import { JSCodeshift } from "jscodeshift";

import { ImportSpecifierOptions } from "./types";

export const getImportSpecifier = (
  j: JSCodeshift,
  { importedName, localName }: ImportSpecifierOptions
) =>
  localName
    ? j.importSpecifier(j.identifier(importedName), j.identifier(localName))
    : j.importSpecifier(j.identifier(importedName));
