import { Collection, JSCodeshift } from "jscodeshift";
import { hasImport } from "./hasImport";
import { hasImportEquals } from "./hasImportEquals";
import { ImportType } from "./types";

export const getImportType = (j: JSCodeshift, source: Collection<unknown>) =>
  hasImport(j, source)
    ? ImportType.IMPORT
    : hasImportEquals(j, source)
    ? ImportType.IMPORT_EQUALS
    : ImportType.REQUIRE;
