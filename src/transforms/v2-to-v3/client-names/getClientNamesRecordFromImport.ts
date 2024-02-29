import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import {
  ImportSpecifierDefault,
  ImportSpecifierPattern,
  getImportEqualsDeclarationType,
} from "../modules";
import { getImportSpecifiers } from "../modules/importModule";
import { getClientDeepImportPath } from "../utils";

export const getClientNamesRecordFromImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientNamesFromDeepImport: string[]
) => {
  const clientNamesRecord: Record<string, string> = {};

  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => typeof importSpecifier === "object"
  ) as ImportSpecifierPattern[];

  for (const { importedName, localName } of specifiersFromNamedImport) {
    if (CLIENT_NAMES.includes(importedName)) {
      clientNamesRecord[importedName] = localName ?? importedName;
    }
  }

  for (const clientName of clientNamesFromDeepImport) {
    const deepImportPath = getClientDeepImportPath(clientName);

    const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (importSpecifier) => typeof importSpecifier === "string"
    ) as ImportSpecifierDefault[];
    if (specifiersFromDeepImport.length > 0) {
      clientNamesRecord[clientName] = specifiersFromDeepImport[0];
    }

    const identifiersFromImportEquals = source.find(
      j.TSImportEqualsDeclaration,
      getImportEqualsDeclarationType(deepImportPath)
    );
    if (identifiersFromImportEquals.length > 0) {
      clientNamesRecord[clientName] = identifiersFromImportEquals.nodes()[0]?.id.name;
    }
  }

  return clientNamesRecord;
};
