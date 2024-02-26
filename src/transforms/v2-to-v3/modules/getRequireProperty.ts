import { JSCodeshift } from "jscodeshift";

import { ImportSpecifierPattern } from "./types";

export const getRequireProperty = (
  j: JSCodeshift,
  { importedName, localName }: ImportSpecifierPattern
) =>
  j.objectProperty.from({
    key: j.identifier(importedName),
    value: j.identifier(localName ?? importedName),
    shorthand: true,
  });
