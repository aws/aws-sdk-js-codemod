import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath, getV3ClientImportSpecifier, getV3ClientTypeNames } from "../get";
import { ClientCodemodOptions } from "../types";
import { addV3ClientModuleImport } from "./addV3ClientModuleImport";

export const addV3ClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, clientMetadataRecord }: ClientCodemodOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const existingImportsForClient = existingImports.filter(
      (importDeclaration) => importDeclaration.value.source.value === v3ClientPackageName
    );

    // Import declaration already exists.
    if (existingImportsForClient.size()) {
      addV3ClientModuleImport(j, existingImportsForClient, {
        localName: v2ClientLocalName,
        importedName: v3ClientName,
      });
    } else {
      // Insert after global import, or service import.
      existingImports
        .filter((importDeclaration) => {
          const sourceValue = importDeclaration.value.source.value as string;

          if (
            sourceValue === PACKAGE_NAME &&
            importDeclaration.value.specifiers?.some(
              (specifier) =>
                ["ImportNamespaceSpecifier", "ImportDefaultSpecifier"].includes(specifier.type) ||
                (specifier.type === "ImportSpecifier" &&
                  specifier.local?.name === v2ClientLocalName)
            )
          ) {
            return true;
          }

          if (sourceValue === getV2ServiceModulePath(v2ClientName)) {
            return true;
          }

          return false;
        })
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
  }
};
