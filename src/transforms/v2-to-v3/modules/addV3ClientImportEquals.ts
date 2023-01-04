import { Collection, JSCodeshift } from "jscodeshift";

import { addV3ClientDefaultImportEquals } from "./addV3ClientDefaultImportEquals";
import { addV3ClientNamedImportEquals } from "./addV3ClientNamedImportEquals";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  addV3ClientDefaultImportEquals(j, source, options);

  if (
    getNewExpressionCount(j, source, options) > 0 ||
    getClientTSTypeRefCount(j, source, options) > 0
  ) {
    addV3ClientNamedImportEquals(j, source, options);
  }
};
