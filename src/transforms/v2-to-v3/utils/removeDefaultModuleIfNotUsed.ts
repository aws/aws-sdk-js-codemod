import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeDefaultImport } from "./removeDefaultImport";
import { removeDefaultRequire } from "./removeDefaultRequire";

export const removeDefaultModuleIfNotUsed = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultImportName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: defaultImportName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    if (containsRequire(j, source)) {
      removeDefaultRequire(j, source, defaultImportName);
    } else {
      removeDefaultImport(j, source, defaultImportName);
    }
  }
};
