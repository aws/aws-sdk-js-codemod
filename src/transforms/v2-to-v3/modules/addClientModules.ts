import { Collection, JSCodeshift } from "jscodeshift";

import { addClientRequires } from "./addClientRequires";
import { addV3ClientImportEquals } from "./addV3ClientImportEquals";
import { addV3ClientImports } from "./addV3ClientImports";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { V3ClientModulesOptions } from "./types";

export const addClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void =>
  hasRequire(j, source)
    ? addClientRequires(j, source, options)
    : hasImportEquals(j, source)
    ? addV3ClientImportEquals(j, source, options)
    : addV3ClientImports(j, source, options);
