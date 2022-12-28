import { Collection, ImportDeclaration, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { getV3ClientImportSpecifier, V3ClientImportSpecifierOptions } from "../get";

export const addV3ClientModuleImport = (
  j: JSCodeshift,
  existingImports: Collection<ImportDeclaration>,
  { localName: v2ClientIdName, importedName: v3ClientName }: V3ClientImportSpecifierOptions
) => {
  const existingImportSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter((importSpecifier) => importSpecifier?.type === "ImportSpecifier") as ImportSpecifier[];

  if (
    !existingImportSpecifiers.find(
      (specifier) =>
        specifier?.imported?.name === v3ClientName && specifier?.local?.name === v2ClientIdName
    )
  ) {
    existingImports
      .nodes()[0]
      .specifiers?.push(
        getV3ClientImportSpecifier(j, { localName: v2ClientIdName, importedName: v3ClientName })
      );
  }
};
