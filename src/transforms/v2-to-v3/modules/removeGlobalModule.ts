import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME_V2 } from "../config";
import { removeImportDefault } from "./removeImportDefault";
import { removeImportEquals } from "./removeImportEquals";
import { removeRequireIdentifier } from "./removeRequireIdentifier";
import { ImportType } from "./types";

export interface RemoveGlobalModuleOptions {
  importType: ImportType;
  v2GlobalName?: string;
}

// Removes the import of "aws-sdk" if it's not used.
export const removeGlobalModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { importType, v2GlobalName }: RemoveGlobalModuleOptions
) => {
  if (!v2GlobalName) return;

  const identifierUsages = source.find(j.Identifier, { name: v2GlobalName });

  // Only usage is import/require.
  if (identifierUsages.size() === 1) {
    const defaultOptions = { localName: v2GlobalName, sourceValue: PACKAGE_NAME_V2 };
    if (importType === ImportType.REQUIRE) {
      removeRequireIdentifier(j, source, defaultOptions);
    } else if (importType === ImportType.IMPORT_EQUALS) {
      removeImportEquals(j, source, defaultOptions);
    } else {
      removeImportDefault(j, source, defaultOptions);
    }
  }
};
