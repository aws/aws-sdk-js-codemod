import { Collection, Identifier, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { getImportEqualsDeclarationType, getImportSpecifiers } from "../modules";
import { getClientDeepImportPath } from "../utils";

export const getClientNamesRecordFromImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientNamesFromDeepImport: string[]
) => {
  const clientNamesRecord: Record<string, string> = {};

  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (specifier) => specifier?.type === "ImportSpecifier"
  ) as ImportSpecifier[];

  for (const specifier of specifiersFromNamedImport) {
    const importedName = specifier.imported.name;
    const localName = (specifier.local as Identifier).name;
    if (CLIENT_NAMES.includes(importedName)) {
      clientNamesRecord[importedName] = localName ?? importedName;
    }
  }

  for (const clientName of clientNamesFromDeepImport) {
    const deepImportPath = getClientDeepImportPath(clientName);

    const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (specifier) =>
        ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
    );
    if (specifiersFromDeepImport.length > 0) {
      clientNamesRecord[clientName] = (specifiersFromDeepImport[0]?.local as Identifier).name;
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
