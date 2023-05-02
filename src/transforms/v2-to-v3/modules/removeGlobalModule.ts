import { Collection, JSCodeshift } from "jscodeshift";

import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { removeImportDefault } from "./removeImportDefault";
import { removeImportEquals } from "./removeImportEquals";
import { removeRequireIdentifier } from "./removeRequireIdentifier";
import { PACKAGE_NAME } from "../config";

export const removeGlobalModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  const identifierUsages = source.find(j.Identifier, { name: v2GlobalName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const defaultOptions = { localName: v2GlobalName, sourceValue: PACKAGE_NAME };
    if (hasRequire(j, source)) {
      removeRequireIdentifier(j, source, defaultOptions);
    } else if (hasImportEquals(j, source)) {
      removeImportEquals(j, source, defaultOptions);
    } else {
      removeImportDefault(j, source, defaultOptions);
    }
  }
};
