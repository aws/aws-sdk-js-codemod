import { Collection, JSCodeshift } from "jscodeshift";

import { ImportType } from "../modules/types";
import { getClientNamesFromDeepImport } from "./getClientNamesFromDeepImport";
import { getClientNamesRecordFromImport } from "./getClientNamesRecordFromImport";
import { getClientNamesRecordFromRequire } from "./getClientNamesRecordFromRequire";

export const getClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
) => {
  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());
  return importType === ImportType.REQUIRE
    ? getClientNamesRecordFromRequire(j, source, clientNamesFromDeepImport)
    : getClientNamesRecordFromImport(j, source, clientNamesFromDeepImport);
};
