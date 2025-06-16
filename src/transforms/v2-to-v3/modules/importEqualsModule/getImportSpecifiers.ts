import type { Collection, JSCodeshift } from "jscodeshift";
import type { ImportSpecifierType } from "../types";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): ImportSpecifierType[] => {
  const importSpecifiers = new Set<ImportSpecifierType>();

  getImportEqualsDeclarations(j, source, path).forEach((importEqualsDeclaration) => {
    importSpecifiers.add({ localName: importEqualsDeclaration.value.id.name as string });
  });

  return Array.from(importSpecifiers);
};
