import { Collection, ImportDefaultSpecifier, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientDefaultImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v3ClientPackageName }: V3ClientModulesOptions
) => {
  const localName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

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
