import { Collection, JSCodeshift } from "jscodeshift";

import { hasRequire } from "../modules";
import { getClientNamesRecordFromImport } from "./getClientNamesRecordFromImport";
import { getClientNamesRecordFromRequire } from "./getClientNamesRecordFromRequire";
import { getV2ClientNamesWithServiceModule } from "./getV2ClientNamesWithServiceModule";

export const getClientNamesRecord = (j: JSCodeshift, source: Collection<unknown>) => {
  const v2ClientNamesWithServiceModule = getV2ClientNamesWithServiceModule(source.toSource());
  return hasRequire(j, source)
    ? getClientNamesRecordFromRequire(j, source, v2ClientNamesWithServiceModule)
    : getClientNamesRecordFromImport(j, source, v2ClientNamesWithServiceModule);
};
