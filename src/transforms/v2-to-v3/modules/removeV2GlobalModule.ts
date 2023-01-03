import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { removeImportEqualsIdentifierName } from "./removeImportEqualsIdentifierName";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeV2GlobalModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: v2GlobalName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const removeIdentifierNameOptions = {
      localName: v2GlobalName,
      sourceValue: PACKAGE_NAME,
    };
    if (hasRequire(j, source)) {
      removeRequireIdentifierName(j, source, removeIdentifierNameOptions);
    } else if (hasImportEquals(j, source)) {
      removeImportEqualsIdentifierName(j, source, removeIdentifierNameOptions);
    } else {
      removeImportIdentifierName(j, source, removeIdentifierNameOptions);
    }
  }
};
