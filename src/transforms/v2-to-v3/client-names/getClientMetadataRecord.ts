import { ClientMetadataRecord } from "../types";

import { getV3ClientName } from "./getV3ClientName";
import { getV3ClientPackageName } from "./getV3ClientPackageName";

export const getClientMetadataRecord = (
  v2ClientNamesRecord: Record<string, string>
): ClientMetadataRecord =>
  Object.entries(
    Object.entries(v2ClientNamesRecord).reduce(
      (acc, [v2ClientName, v2ClientLocalName]) => ({
        ...acc,
        [v2ClientName]: {
          v2ClientLocalName,
          v3ClientName: getV3ClientName(v2ClientName),
          v3ClientPackageName: getV3ClientPackageName(v2ClientName),
        },
      }),
      {}
    ) as ClientMetadataRecord
  )
    .sort(([, { v3ClientPackageName: a }], [, { v3ClientPackageName: b }]) => b.localeCompare(a))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
