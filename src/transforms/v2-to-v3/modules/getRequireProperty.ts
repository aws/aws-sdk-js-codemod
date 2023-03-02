import { JSCodeshift } from "jscodeshift";

import { RequirePropertyOptions } from "./types";

export const getRequireProperty = (
  j: JSCodeshift,
  { keyName, valueName }: RequirePropertyOptions
) =>
  j.objectProperty.from({
    key: j.identifier(keyName),
    value: j.identifier(valueName ?? keyName),
    shorthand: true,
  });
