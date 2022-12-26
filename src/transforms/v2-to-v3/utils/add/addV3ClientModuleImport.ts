import { Collection, ImportDeclaration, JSCodeshift } from "jscodeshift";

export const addV3ClientModuleImport = (
  j: JSCodeshift,
  existingImports: Collection<ImportDeclaration>,
  importSpecifier: string
) => {
  const existingImportSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat();

  if (!existingImportSpecifiers.find((specifier) => specifier?.local?.name === importSpecifier)) {
    existingImports.nodes()[0].specifiers?.push(j.importSpecifier(j.identifier(importSpecifier)));
  }
};
