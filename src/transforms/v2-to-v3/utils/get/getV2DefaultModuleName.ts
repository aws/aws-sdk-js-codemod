import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { containsRequire } from "../containsRequire";
import { getImportSpecifiers } from "./getImportSpecifiers";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

export const getV2DefaultModuleName = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  if (containsRequire(j, source)) {
    return getRequireIdentifierName(j, source, PACKAGE_NAME);
  }

  const importSpecifiers = getImportSpecifiers(j, source, PACKAGE_NAME);
  if (importSpecifiers && importSpecifiers.length === 1) {
    if (["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(importSpecifiers[0].type)) {
      return importSpecifiers[0].local?.name;
    }
  }

  return undefined;
};
