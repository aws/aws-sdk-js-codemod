import { Collection, JSCodeshift } from "jscodeshift";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { ImportType } from "./types";

export const getImportType = (j: JSCodeshift, source: Collection<unknown>) =>
  hasRequire(j, source)
    ? ImportType.REQUIRE
    : hasImportEquals(j, source)
    ? ImportType.IMPORT_EQUALS
    : ImportType.IMPORT;
