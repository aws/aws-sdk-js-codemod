import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { hasRequire } from "../hasRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export const getV2ClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>
): Record<string, string> => {
  const getIdentifierNameFn = hasRequire(j, source)
    ? getRequireIdentifierName
    : getImportIdentifierName;

  return Object.fromEntries(
    CLIENT_NAMES.map((clientName) => [
      clientName,
      getIdentifierNameFn(j, source, getV2ServiceModulePath(clientName)),
    ]).filter(([, v2ClientLocalName]) => v2ClientLocalName !== undefined)
  );
};
