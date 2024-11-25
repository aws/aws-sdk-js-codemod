import type { Collection, JSCodeshift } from "jscodeshift";
import { hasImport } from "./hasImport.ts";
import { hasImportEquals } from "./hasImportEquals.ts";
import { hasRequire } from "./hasRequire.ts";
import { ImportType } from "./types.ts";

export const getImportType = (j: JSCodeshift, source: Collection<unknown>) =>
  hasImport(j, source)
    ? ImportType.IMPORT
    : hasImportEquals(j, source)
      ? ImportType.IMPORT_EQUALS
      : hasRequire(j, source)
        ? ImportType.REQUIRE
        : null;
