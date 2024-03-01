import { Collection, JSCodeshift } from "jscodeshift";
import { removeImportEquals } from "./importEqualsModule";
import { removeImport } from "./importModule";
import { removeRequire } from "./requireModule";
import { ImportType } from "./types";

export const removeModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
) => {
  switch (importType) {
    case ImportType.REQUIRE: {
      removeRequire(j, source);
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
