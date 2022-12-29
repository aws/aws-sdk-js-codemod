import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { hasRequire } from "../has";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

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
      getIdentifierNameFn(j, source, clientName),
    ]).filter(([, v2ClientLocalName]) => v2ClientLocalName !== undefined)
  );
};
