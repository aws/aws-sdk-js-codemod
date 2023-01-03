import { Collection, ImportDeclaration, ImportDefaultSpecifier, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";

export const addV3ClientDefaultImport = (
  j: JSCodeshift,
  existingImports: Collection<ImportDeclaration>,
  v2ClientLocalName: string
) => {
  const localName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const existingImportDefaultSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter(
      (importSpecifier) => importSpecifier?.type === "ImportDefaultSpecifier"
    ) as ImportDefaultSpecifier[];

  if (!existingImportDefaultSpecifiers.find((specifier) => specifier?.local?.name === localName)) {
    existingImports.nodes()[0].specifiers?.push(j.importDefaultSpecifier(j.identifier(localName)));
  }
};
