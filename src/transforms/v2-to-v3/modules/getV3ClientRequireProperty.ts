import { JSCodeshift } from "jscodeshift";

import { V3ClientRequirePropertyOptions } from "./types";

export const getV3ClientRequireProperty = (
  j: JSCodeshift,
  { keyName, valueName }: V3ClientRequirePropertyOptions
) =>
  j.objectProperty.from({
    key: j.identifier(keyName),
    value: j.identifier(valueName),
    shorthand: true,
  });
