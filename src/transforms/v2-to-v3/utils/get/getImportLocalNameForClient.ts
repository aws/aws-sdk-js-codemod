import { Collection, Identifier, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

const getImportSpecifiers = (j: JSCodeshift, source: Collection<unknown>, sourceValue: string) =>
  source
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
      source: { value: sourceValue },
    })
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat();

export const getImportLocalNameForClient = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientName: string
): string | undefined => {
  const specifiersFromNamedImport = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (specifier) => specifier?.type === "ImportSpecifier"
  ) as ImportSpecifier[];

  const clientImportSpecifier = specifiersFromNamedImport.find(
    (specifier) => specifier?.imported.name === clientName
  );
  if (clientImportSpecifier) {
    return (clientImportSpecifier.local as Identifier).name;
  }

  const deepImportPath = getV2ServiceModulePath(clientName);
  const specifiersFromDeepImport = getImportSpecifiers(j, source, deepImportPath).filter(
    (specifier) =>
      ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
  );

  if (specifiersFromDeepImport.length > 0) {
    return (specifiersFromDeepImport[0]?.local as Identifier).name;
  }

  return undefined;
};
