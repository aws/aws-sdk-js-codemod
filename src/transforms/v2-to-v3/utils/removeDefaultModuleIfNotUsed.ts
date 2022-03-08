import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeDefaultImport } from "./removeDefaultImport";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeDefaultModuleIfNotUsed = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultModuleName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: defaultModuleName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    if (containsRequire(j, source)) {
      removeRequireIdentifierName(j, source, {
        identifierName: defaultModuleName,
        literalValue: "aws-sdk",
      });
    } else {
      removeDefaultImport(j, source, defaultModuleName);
    }
  }
};
