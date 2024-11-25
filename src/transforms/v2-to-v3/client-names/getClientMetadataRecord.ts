import type { ClientMetadataRecord } from "../types.ts";
import { getV3ClientName } from "./getV3ClientName.ts";
import { getV3ClientPackageName } from "./getV3ClientPackageName.ts";

export const getClientMetadataRecord = (
  v2ClientNamesRecord: Record<string, string>
): ClientMetadataRecord =>
  Object.entries(
    Object.entries(v2ClientNamesRecord).reduce(
      (acc: ClientMetadataRecord, [v2ClientName, v2ClientLocalName]) => {
        acc[v2ClientName] = {
          v2ClientLocalName,
          v3ClientName: getV3ClientName(v2ClientName),
          v3ClientPackageName: getV3ClientPackageName(v2ClientName),
        };
        return acc;
      },
      {}
    )
  )
    .sort(([, { v3ClientPackageName: a }], [, { v3ClientPackageName: b }]) => b.localeCompare(a))
    .reduce((acc: ClientMetadataRecord, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
