import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { getV2DefaultImportName } from "./getV2DefaultImportName";
import { getV2DefaultRequireName } from "./getV2DefaultRequireName";

export const getV2DefaultModuleName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined =>
  containsRequire(j, source)
    ? getV2DefaultRequireName(j, source)
    : getV2DefaultImportName(j, source);
