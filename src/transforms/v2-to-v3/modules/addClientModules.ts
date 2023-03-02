import { Collection, JSCodeshift } from "jscodeshift";

import { addClientImportEquals } from "./addClientImportEquals";
import { addClientRequires } from "./addClientRequires";
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
    ? addClientImportEquals(j, source, options)
    : addV3ClientImports(j, source, options);
