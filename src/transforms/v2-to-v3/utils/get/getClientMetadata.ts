import { ClientMetadataMap } from "../types";
import { getV3ClientName } from "./getV3ClientName";
import { getV3ClientPackageName } from "./getV3ClientPackageName";

export const getClientMetadata = (v2ClientNamesRecord: Record<string, string>): ClientMetadataMap =>
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
    ) as ClientMetadataMap
  )
    .sort(([, { v3ClientPackageName: a }], [, { v3ClientPackageName: b }]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
