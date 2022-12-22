import { Collection, JSCodeshift } from "jscodeshift";

import { AddV3ClientModuleOptions } from "./addV3ClientModule";
import { PACKAGE_NAME } from "./config";
import { getV2ServiceModulePath } from "./get";

export const addV3ClientImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v3ClientName, v3ClientPackageName }: AddV3ClientModuleOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  // Import declaration already exists.
  if (existingImports.size()) {
    existingImports.forEach((nodePath) => {
      // Append to existing import if specifier not present.
      if (!nodePath.value.specifiers?.find((specifier) => specifier.local?.name === v3ClientName)) {
        nodePath.value.specifiers?.push(j.importSpecifier(j.identifier(v3ClientName)));
      }
    });
    return;
  }

  // Insert after default import if present. If not, insert after service import.
  source
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.value.source.value === PACKAGE_NAME ||
        path.value.source.value === getV2ServiceModulePath(v2ClientName)
    )
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier(v3ClientName))],
        j.stringLiteral(v3ClientPackageName)
      )
    );
};
