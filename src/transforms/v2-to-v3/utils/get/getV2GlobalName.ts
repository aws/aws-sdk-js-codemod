import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { hasRequire } from "../has";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireLocalNameForClient } from "./getRequireLocalNameForClient";

export const getV2GlobalName = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  if (hasRequire(j, source)) {
    return getRequireLocalNameForClient(j, source, PACKAGE_NAME);
  }
  return getImportIdentifierName(j, source, PACKAGE_NAME);
};
