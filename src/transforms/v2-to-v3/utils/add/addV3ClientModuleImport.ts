import { Collection, ImportDeclaration, ImportDefaultSpecifier, JSCodeshift } from "jscodeshift";

export const addV3ClientModuleImport = (
  j: JSCodeshift,
  existingImports: Collection<ImportDeclaration>,
  localName: string
) => {
  const existingImportSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter(
      (importSpecifier) => importSpecifier?.type === "ImportDefaultSpecifier"
    ) as ImportDefaultSpecifier[];

  if (!existingImportSpecifiers.find((specifier) => specifier?.local?.name === localName)) {
    existingImports.nodes()[0].specifiers?.push(j.importDefaultSpecifier(j.identifier(localName)));
  }
};
