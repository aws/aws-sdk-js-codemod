import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { containsRequire } from "../containsRequire";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeDefaultModuleIfNotUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  defaultModuleName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: defaultModuleName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const removeIdentifierNameOptions = {
      identifierName: defaultModuleName,
      literalValue: PACKAGE_NAME,
    };
    if (containsRequire(j, source)) {
      removeRequireIdentifierName(j, source, removeIdentifierNameOptions);
    } else {
      removeImportIdentifierName(j, source, removeIdentifierNameOptions);
    }
  }
};
