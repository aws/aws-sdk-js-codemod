import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV3ClientTypeNames } from "../ts-type";
import { getV2ServiceModulePath } from "../utils";
import { addV3ClientDefaultImport } from "./addV3ClientDefaultImport";
import { addV3ClientNamedImport } from "./addV3ClientNamedImport";
import { getV3ClientImportSpecifier } from "./getV3ClientImportSpecifier";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
    v3ClientName,
    v3ClientPackageName,
  }: V3ClientModulesOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  // Import declaration already exists.
  if (existingImports.size()) {
    addV3ClientNamedImport(j, existingImports, {
      importedName: v3ClientName,
      localName: v2ClientLocalName,
    });
  } else {
    // Insert after global import, or service import.
    source
      .find(j.ImportDeclaration)
      .filter((importDeclaration) => {
        const sourceValue = importDeclaration.value.source.value as string;

        if (
          sourceValue === PACKAGE_NAME &&
          importDeclaration.value.specifiers?.some(
            (specifier) =>
              ["ImportNamespaceSpecifier", "ImportDefaultSpecifier"].includes(specifier.type) ||
              (specifier.type === "ImportSpecifier" && specifier.local?.name === v2ClientLocalName)
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

  // Add default import for types, if needed.
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2GlobalName });

  if (v3ClientTypeNames.length > 0) {
    const clientImports = source.find(j.ImportDeclaration, {
      source: { value: v3ClientPackageName },
    });
    addV3ClientDefaultImport(j, clientImports, v2ClientLocalName);
  }
};
