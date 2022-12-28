import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { containsRequire } from "../containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export const getV2ClientNames = (j: JSCodeshift, source: Collection<unknown>): string[] => {
  if (containsRequire(j, source)) {
    return CLIENT_NAMES.map((clientName) =>
      getRequireIdentifierName(j, source, getV2ServiceModulePath(clientName))
    ).filter((v2ServiceModuleName) => v2ServiceModuleName !== undefined) as string[];
  }

  return CLIENT_NAMES.filter((clientName) => {
    const importSpecifiers = getImportIdentifierName(j, source, getV2ServiceModulePath(clientName));
    if (
      importSpecifiers &&
      importSpecifiers.map((importSpecifier) => importSpecifier.local?.name).includes(clientName)
    ) {
      return true;
    }
    return false;
  });
};
