import { Collection, JSCodeshift } from "jscodeshift";

import { getClientNamesFromDeepImport } from "./getClientNamesFromDeepImport";
import { getClientNamesRecordFromImport } from "./getClientNamesRecordFromImport";
import { getClientNamesRecordFromRequire } from "./getClientNamesRecordFromRequire";
import { hasRequire } from "../modules";

export const getClientNamesRecord = (j: JSCodeshift, source: Collection<unknown>) => {
  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());
  return hasRequire(j, source)
    ? getClientNamesRecordFromRequire(j, source, clientNamesFromDeepImport)
    : getClientNamesRecordFromImport(j, source, clientNamesFromDeepImport);
};
