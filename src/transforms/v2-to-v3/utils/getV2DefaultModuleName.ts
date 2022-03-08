import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "./config";
import { containsRequire } from "./containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

export const getV2DefaultModuleName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined =>
  containsRequire(j, source)
    ? getRequireIdentifierName(j, source, PACKAGE_NAME)
    : getImportIdentifierName(j, source, PACKAGE_NAME);
