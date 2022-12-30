import {
  Collection,
  Identifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSCodeshift,
} from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

const getImportSpecifiers = (j: JSCodeshift, source: Collection<unknown>, sourceValue: string) =>
  source
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
      source: { value: sourceValue },
    })
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat() as (ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier)[];

export const getV2ClientNamesRecordFromImport = (j: JSCodeshift, source: Collection<unknown>) => {
  const v2ClientNamesRecord: Record<string, string> = {};

  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (specifier) => specifier?.type === "ImportSpecifier"
  ) as ImportSpecifier[];

  for (const clientName of CLIENT_NAMES) {
    const clientImportSpecifier = specifiersFromNamedImport.find(
      (specifier) => specifier?.imported.name === clientName
    );

    if (clientImportSpecifier) {
      v2ClientNamesRecord[clientName] = (clientImportSpecifier.local as Identifier).name;
      continue;
    }

    const deepImportPath = getV2ServiceModulePath(clientName);
    const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
      (specifier) =>
        ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
    );

    if (specifiersFromDeepImport.length > 0) {
      v2ClientNamesRecord[clientName] = (specifiersFromDeepImport[0]?.local as Identifier).name;
    }
  }

  return v2ClientNamesRecord;
};
