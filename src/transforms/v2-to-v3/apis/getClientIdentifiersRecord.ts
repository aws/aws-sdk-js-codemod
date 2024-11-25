import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifiersRecord } from "../types.ts";
import { getClientIdentifiers } from "./getClientIdentifiers.ts";

export interface GetClientIdentifiersRecordOptions {
  v2GlobalName?: string;
  v2ClientNamesRecord: Record<string, string>;
}

export const getClientIdentifiersRecord = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, v2ClientNamesRecord }: GetClientIdentifiersRecordOptions
): ClientIdentifiersRecord =>
  Object.fromEntries(
    Object.entries(v2ClientNamesRecord).map(([v2ClientName, v2ClientLocalName]) => [
      v2ClientName,
      getClientIdentifiers(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName }),
    ])
  );
