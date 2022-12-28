import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { containsRequire } from "../containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

export const getV2GlobalName = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  if (containsRequire(j, source)) {
    return getRequireIdentifierName(j, source, PACKAGE_NAME);
  }
  return getImportIdentifierName(j, source, PACKAGE_NAME);
};
