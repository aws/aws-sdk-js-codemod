import { getV3ClientName } from "./getV3ClientName";
import { getV3ClientPackageName } from "./getV3ClientPackageName";
import { ClientMetadataMap } from "./types";

export const getClientMetadata = (v2ClientNames: string[]): ClientMetadataMap =>
  Object.entries(
    v2ClientNames.reduce(
      (acc, v2ClientName) => ({
        ...acc,
        [v2ClientName]: {
          v3ClientName: getV3ClientName(v2ClientName),
          v3ClientPackageName: getV3ClientPackageName(v2ClientName),
        },
      }),
      {}
    ) as ClientMetadataMap
  )
    .sort(([, { v3ClientPackageName: a }], [, { v3ClientPackageName: b }]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
