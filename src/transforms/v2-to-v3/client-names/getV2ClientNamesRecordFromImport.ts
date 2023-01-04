import { Collection, Identifier, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { getImportEqualsDeclaration } from "../modules";
import { getImportSpecifiers } from "../modules";
import { getV2ServiceModulePath } from "../utils";

export const getV2ClientNamesRecordFromImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientNamesWithServiceModule: string[]
) => {
  const v2ClientNamesRecord: Record<string, string> = {};

  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (specifier) => specifier?.type === "ImportSpecifier"
  ) as ImportSpecifier[];

  for (const specifier of specifiersFromNamedImport) {
    const importedName = specifier.imported.name;
    const localName = (specifier.local as Identifier).name;
    if (CLIENT_NAMES.includes(importedName)) {
      v2ClientNamesRecord[importedName] = localName ?? importedName;
    }
  }

  for (const clientName of v2ClientNamesWithServiceModule) {
    const deepImportPath = getV2ServiceModulePath(clientName);

    const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (specifier) =>
        ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
    );
    if (specifiersFromDeepImport.length > 0) {
      v2ClientNamesRecord[clientName] = (specifiersFromDeepImport[0]?.local as Identifier).name;
    }

    const identifiersFromImportEquals = source.find(
      j.TSImportEqualsDeclaration,
      getImportEqualsDeclaration(deepImportPath)
    );
    if (identifiersFromImportEquals.length > 0) {
      v2ClientNamesRecord[clientName] = identifiersFromImportEquals.nodes()[0]?.id.name;
    }
  }

  return v2ClientNamesRecord;
};
