import type { Collection, JSCodeshift } from "jscodeshift";
import { removeImportEquals } from "./importEqualsModule/index.ts";
import { removeImport } from "./importModule/index.ts";
import { removeRequire } from "./requireModule/index.ts";
import { ImportType } from "./types.ts";

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
