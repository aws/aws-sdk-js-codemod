import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { hasRequire } from "../has";
import { getImportLocalNameForClient } from "./getImportLocalNameForClient";
import { getRequireLocalNameForClient } from "./getRequireLocalNameForClient";

export const getV2GlobalName = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  if (hasRequire(j, source)) {
    return getRequireLocalNameForClient(j, source, PACKAGE_NAME);
  }
  return getImportLocalNameForClient(j, source, PACKAGE_NAME);
};
