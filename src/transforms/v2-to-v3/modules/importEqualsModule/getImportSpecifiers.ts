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
    const localName = importEqualsDeclaration.value.id.name;
    if (typeof localName !== "string") {
      throw new Error("Please report your use case on https://github.com/aws/aws-sdk-js-codemod");
    }
    importSpecifiers.add({ localName });
  });

  return Array.from(importSpecifiers);
};
