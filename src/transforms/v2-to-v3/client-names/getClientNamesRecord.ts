import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { ImportType } from "../modules";
import * as importEqualsModule from "../modules/importEqualsModule";
import * as importModule from "../modules/importModule";
import * as requireModule from "../modules/requireModule";
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

  for (const { importedName, localName } of getImportSpecifiers(j, source)) {
    const clientName = importedName ?? localName;
    if (CLIENT_NAMES.includes(clientName)) {
      clientNamesRecord[clientName] = localName;
    }
  }

  // Populate client names for type transformations
  // Ref: https://github.com/aws/aws-sdk-js-codemod/issues/663
  for (const clientName of getClientNamesFromDeepImport(source.toSource())) {
    if (!(clientName in clientNamesRecord)) {
      clientNamesRecord[clientName] = clientName;
    }
  }

  return clientNamesRecord;
};
