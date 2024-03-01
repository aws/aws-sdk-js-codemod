import { Collection, JSCodeshift } from "jscodeshift";
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
      // ToDo
      break;
    }
    case ImportType.IMPORT: {
      // ToDo
      break;
    }
  }
};
