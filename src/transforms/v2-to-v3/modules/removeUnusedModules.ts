import { Collection, JSCodeshift } from "jscodeshift";
import { removeImportEquals } from "./importEqualsModule";
import { removeImport } from "./importModule";
import { ImportType } from "./types";

export const removeUnusedModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
) => {
  switch (importType) {
    case ImportType.REQUIRE: {
      // ToDo
      break;
    }
    case ImportType.IMPORT_EQUALS: {
      removeImportEquals(j, source);
      break;
    }
    case ImportType.IMPORT: {
      removeImport(j, source);
      break;
    }
  }
};
