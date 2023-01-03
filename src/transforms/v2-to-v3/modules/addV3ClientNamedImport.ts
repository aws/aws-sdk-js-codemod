import { Collection, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "../utils";
import { getV3ClientImportSpecifier } from "./getV3ClientImportSpecifier";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientNamedImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v3ClientPackageName, v3ClientName }: V3ClientModulesOptions
) => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  if (existingImports.size()) {
    const existingImportSpecifiers = existingImports
      .nodes()
      .map((importDeclaration) => importDeclaration.specifiers)
      .flat()
      .filter(
        (importSpecifier) => importSpecifier?.type === "ImportSpecifier"
      ) as ImportSpecifier[];

    if (
      existingImportSpecifiers.find(
        (specifier) =>
          specifier?.imported?.name === v3ClientName && specifier?.local?.name === v2ClientLocalName
      )
    ) {
      return;
    }

    existingImports
      .nodes()[0]
      .specifiers?.push(
        getV3ClientImportSpecifier(j, { localName: v2ClientLocalName, importedName: v3ClientName })
      );
    return;
  }

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
};
