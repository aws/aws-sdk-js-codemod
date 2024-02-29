import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { ImportType } from "../modules";
import * as importEqualsModule from "../modules/importEqualsModule";
import * as importModule from "../modules/importModule";
import * as requireModule from "../modules/requireModule";
import { getClientDeepImportPath } from "../utils";
import { getClientNamesFromDeepImport } from "./getClientNamesFromDeepImport";

export const getClientNamesRecord = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
) => {
  const clientNamesRecord: Record<string, string> = {};

  const { getImportSpecifiers } =
    importType === ImportType.REQUIRE
      ? requireModule
      : importType === ImportType.IMPORT_EQUALS
      ? importEqualsModule
      : importModule;

  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => importSpecifier.importedName
  );

  for (const { importedName, localName } of specifiersFromNamedImport) {
    const clientName = importedName ?? localName;
    if (CLIENT_NAMES.includes(clientName)) {
      clientNamesRecord[clientName] = localName;
    }
  }

  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());
  for (const clientName of clientNamesFromDeepImport) {
    const deepImportPath = getClientDeepImportPath(clientName);

    const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (importSpecifier) => !importSpecifier.importedName
    );
    if (specifiersFromDeepImport.length > 0) {
      clientNamesRecord[clientName] = specifiersFromDeepImport[0].localName;
    }
  }

  // Populate client names for type transformations
  // Ref: https://github.com/aws/aws-sdk-js-codemod/issues/663
  for (const clientName of clientNamesFromDeepImport) {
    if (!(clientName in clientNamesRecord)) {
      clientNamesRecord[clientName] = clientName;
    }
  }

  return clientNamesRecord;
};
