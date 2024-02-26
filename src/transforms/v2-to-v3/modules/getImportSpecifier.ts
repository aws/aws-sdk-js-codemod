import { JSCodeshift } from "jscodeshift";

import { ImportSpecifierPattern } from "./types";

export const getImportSpecifier = (
  j: JSCodeshift,
  { importedName, localName }: ImportSpecifierPattern
) =>
  localName
    ? j.importSpecifier(j.identifier(importedName), j.identifier(localName))
    : j.importSpecifier(j.identifier(importedName));
