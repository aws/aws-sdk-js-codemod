import { JSCodeshift } from "jscodeshift";

import { RequirePropertyOptions } from "./types";

export const getV3ClientRequireProperty = (
  j: JSCodeshift,
  { keyName, valueName }: RequirePropertyOptions
) =>
  j.objectProperty.from({
    key: j.identifier(keyName),
    value: j.identifier(valueName ?? keyName),
    shorthand: true,
  });
