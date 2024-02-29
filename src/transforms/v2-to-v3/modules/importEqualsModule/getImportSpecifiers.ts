import { Collection, JSCodeshift } from "jscodeshift";
import { ImportSpecifierType } from "../types";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  getImportEqualsDeclarations(j, source, path).forEach((importEqualsDeclaration) => {
    importSpecifiers.add({ localName: importEqualsDeclaration.value.id.name });
  });

  return Array.from(importSpecifiers);
};
