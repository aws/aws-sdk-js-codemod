import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { getImportSpecifiers } from "../modules/requireModule";
import { getClientDeepImportPath } from "../utils";

export const getClientNamesRecordFromRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientNamesFromDeepImport: string[]
) => {
  const clientNamesRecord: Record<string, string> = {};

  const idPropertiesFromObjectPattern = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => importSpecifier.importedName
  );

  for (const { importedName, localName } of idPropertiesFromObjectPattern) {
    const clientName = importedName ?? localName;
    if (CLIENT_NAMES.includes(clientName)) {
      clientNamesRecord[clientName] = localName;
    }
  }

  for (const clientName of clientNamesFromDeepImport) {
    const deepImportPath = getClientDeepImportPath(clientName);
    const idsFromDefaultImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (importSpecifier) => !importSpecifier.importedName
    );
    if (idsFromDefaultImport.length) {
      clientNamesRecord[clientName] = idsFromDefaultImport[0].localName;
    }
  }

  return clientNamesRecord;
};
