import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath, getV3ClientImportSpecifier, getV3ClientTypeNames } from "../get";
import { addV3ClientModuleImport } from "./addV3ClientModuleImport";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";

export const addV3ClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
    v3ClientName,
    v3ClientPackageName,
  }: AddV3ClientModulesOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  // Import declaration already exists.
  if (existingImports.size()) {
    addV3ClientModuleImport(j, existingImports, {
      localName: v2ClientLocalName,
      importedName: v3ClientName,
    });
  } else {
    // Insert after global import or service import, whichever comes first.
    source
      .find(j.ImportDeclaration)
      .filter((path) =>
        [PACKAGE_NAME, getV2ServiceModulePath(v2ClientName)].includes(
          path.value.source.value as string
        )
      )
      .at(0)
      .insertAfter(
        j.importDeclaration(
          [
            getV3ClientImportSpecifier(j, {
              localName: v2ClientLocalName,
              importedName: v3ClientName,
            }),
          ],
          j.stringLiteral(v3ClientPackageName)
        )
      );
  }

  // Add require for input/output types, if needed.
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2GlobalName });

  if (v3ClientTypeNames.length > 0) {
    const clientImports = source.find(j.ImportDeclaration, {
      source: { value: v3ClientPackageName },
    });
    for (const v3ClientTypeName of v3ClientTypeNames.sort()) {
      addV3ClientModuleImport(j, clientImports, {
        localName: v3ClientTypeName,
        importedName: v3ClientTypeName,
      });
    }
  }
};
