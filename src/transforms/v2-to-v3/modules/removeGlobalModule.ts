import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { removeImportDefault } from "./removeImportDefault";
import { removeImportEquals } from "./removeImportEquals";
import { removeRequireIdentifier } from "./removeRequireIdentifier";

// Removes the import of "aws-sdk" if it's not used.
export const removeGlobalModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  const identifierUsages = source.find(j.Identifier, { name: v2GlobalName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const defaultOptions = { localName: v2GlobalName, sourceValue: PACKAGE_NAME };
    removeRequireIdentifier(j, source, defaultOptions);
    removeImportEquals(j, source, defaultOptions);
    removeImportDefault(j, source, defaultOptions);
  }
};
