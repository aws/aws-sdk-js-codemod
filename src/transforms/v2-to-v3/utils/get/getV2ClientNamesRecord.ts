import { Collection, JSCodeshift } from "jscodeshift";

import { hasRequire } from "../has";
import { getV2ClientNamesRecordFromImport } from "./getV2ClientNamesRecordFromImport";
import { getV2ClientNamesRecordFromRequire } from "./getV2ClientNamesRecordFromRequire";

export const getV2ClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientNamesWithServiceModule: string[]
) =>
  hasRequire(j, source)
    ? getV2ClientNamesRecordFromRequire(j, source, v2ClientNamesWithServiceModule)
    : getV2ClientNamesRecordFromImport(j, source, v2ClientNamesWithServiceModule);
