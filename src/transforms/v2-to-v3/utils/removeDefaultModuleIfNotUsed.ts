import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeDefaultModuleIfNotUsed = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultModuleName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: defaultModuleName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const removeIdentifierNameOptions = {
      identifierName: defaultModuleName,
      literalValue: "aws-sdk",
    };
    if (containsRequire(j, source)) {
      removeRequireIdentifierName(j, source, removeIdentifierNameOptions);
    } else {
      removeImportIdentifierName(j, source, removeIdentifierNameOptions);
    }
  }
};
