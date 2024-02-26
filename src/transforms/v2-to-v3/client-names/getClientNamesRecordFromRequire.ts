import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import {
  ImportSpecifierDefault,
  ImportSpecifierPattern,
  getRequireDeclaratorsWithProperty,
} from "../modules";
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
    if (CLIENT_NAMES.includes(importedName)) {
      clientNamesRecord[importedName] = localName || importedName;
    }
  }

  const declaratorsWithProperty = getRequireDeclaratorsWithProperty(j, source, {
    sourceValue: PACKAGE_NAME,
  }).nodes();

  for (const declaratorWithProperty of declaratorsWithProperty) {
    const { id, init } = declaratorWithProperty;
    if (
      id.type === "Identifier" &&
      init != undefined &&
      init.type === "MemberExpression" &&
      init.property.type === "Identifier"
    ) {
      const clientName = (init.property as Identifier).name;
      if (CLIENT_NAMES.includes(clientName)) {
        clientNamesRecord[clientName] = (id as Identifier).name;
      }
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
