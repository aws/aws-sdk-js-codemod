import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { containsRequire } from "../containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export const getV2ClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>
): Record<string, string> => {
  const getIdentifierNameFn = containsRequire(j, source)
    ? getRequireIdentifierName
    : getImportIdentifierName;

  return Object.fromEntries(
    CLIENT_NAMES.map((clientName) => [
      clientName,
      getIdentifierNameFn(j, source, getV2ServiceModulePath(clientName)),
    ]).filter(([, v2ClientIdName]) => v2ClientIdName !== undefined)
  );
};
