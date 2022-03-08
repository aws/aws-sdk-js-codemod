import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { getV2ClientImportNames } from "./getV2ClientImportNames";
import { getV2ClientRequireNames } from "./getV2ClientRequireNames";

export const getV2ClientModuleNames = (j: JSCodeshift, source: Collection<any>): string[] =>
  containsRequire(j, source)
    ? getV2ClientRequireNames(j, source)
    : getV2ClientImportNames(j, source);
