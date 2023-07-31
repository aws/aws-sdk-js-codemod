import { JSCodeshift } from "jscodeshift";

import { ImportSpecifierOptions } from "./types";

export const getRequireProperty = (
  j: JSCodeshift,
  { importedName, localName }: ImportSpecifierOptions
) =>
  j.objectProperty.from({
    key: j.identifier(importedName),
    value: j.identifier(localName ?? importedName),
    shorthand: true,
  });
