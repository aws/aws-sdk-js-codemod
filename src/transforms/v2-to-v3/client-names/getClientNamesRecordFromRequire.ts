import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { ImportSpecifierDefault, ImportSpecifierPattern } from "../modules";
import { getImportSpecifiers } from "../modules/requireModule";
import { getClientDeepImportPath } from "../utils";

export const getClientNamesRecordFromRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientNamesFromDeepImport: string[]
) => {
  const clientNamesRecord: Record<string, string> = {};

  const idPropertiesFromObjectPattern = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => typeof importSpecifier === "object"
  ) as ImportSpecifierPattern[];

  for (const { importedName, localName } of idPropertiesFromObjectPattern) {
    const clientName = importedName ?? localName;
    if (CLIENT_NAMES.includes(clientName)) {
      clientNamesRecord[clientName] = localName;
    }
  }

  for (const clientName of clientNamesFromDeepImport) {
    const deepImportPath = getClientDeepImportPath(clientName);
    const idsFromDefaultImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (importSpecifier) => typeof importSpecifier === "string"
    ) as ImportSpecifierDefault[];
    if (idsFromDefaultImport.length) {
      clientNamesRecord[clientName] = idsFromDefaultImport[0];
    }
  }

  return clientNamesRecord;
};
