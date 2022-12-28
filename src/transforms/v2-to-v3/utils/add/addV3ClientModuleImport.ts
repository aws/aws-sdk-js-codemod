import { Collection, ImportDeclaration, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { getV3ClientImportSpecifier, V3ClientImportSpecifierOptions } from "../get";

export const addV3ClientModuleImport = (
  j: JSCodeshift,
  existingImports: Collection<ImportDeclaration>,
  { localName, importedName }: V3ClientImportSpecifierOptions
) => {
  const existingImportSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter((importSpecifier) => importSpecifier?.type === "ImportSpecifier") as ImportSpecifier[];

  if (
    !existingImportSpecifiers.find(
      (specifier) =>
        specifier?.imported?.name === importedName && specifier?.local?.name === localName
    )
  ) {
    existingImports
      .nodes()[0]
      .specifiers?.push(getV3ClientImportSpecifier(j, { localName, importedName }));
  }
};
