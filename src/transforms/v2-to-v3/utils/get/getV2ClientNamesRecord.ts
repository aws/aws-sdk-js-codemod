import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { hasRequire } from "../has";
import { getImportLocalNameForClient } from "./getImportLocalNameForClient";
import { getRequireLocalNameForClient } from "./getRequireLocalNameForClient";

export const getV2ClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>
): Record<string, string> => {
  const getIdentifierNameFn = hasRequire(j, source)
    ? getRequireLocalNameForClient
    : getImportLocalNameForClient;

  return Object.fromEntries(
    CLIENT_NAMES.map((clientName) => [
      clientName,
      getIdentifierNameFn(j, source, clientName),
    ]).filter(([, v2ClientLocalName]) => v2ClientLocalName !== undefined)
  );
};
