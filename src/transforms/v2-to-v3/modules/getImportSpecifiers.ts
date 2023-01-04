import { Collection, JSCodeshift } from "jscodeshift";
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from "jscodeshift";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string
) =>
  source
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
      source: { value: sourceValue },
    })
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat() as (ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier)[];
