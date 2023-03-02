import { Collection, JSCodeshift } from "jscodeshift";

import { addV3ClientImportEquals } from "./addV3ClientImportEquals";
import { addV3ClientImports } from "./addV3ClientImports";
import { addV3ClientRequires } from "./addV3ClientRequires";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { V3ClientModulesOptions } from "./types";

export const addClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void =>
  hasRequire(j, source)
    ? addV3ClientRequires(j, source, options)
    : hasImportEquals(j, source)
    ? addV3ClientImportEquals(j, source, options)
    : addV3ClientImports(j, source, options);
