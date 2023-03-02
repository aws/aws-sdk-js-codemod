import { Collection, JSCodeshift } from "jscodeshift";

import { addClientImportEquals } from "./addClientImportEquals";
import { addClientImports } from "./addClientImports";
import { addClientRequires } from "./addClientRequires";
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
    : addClientImports(j, source, options);
