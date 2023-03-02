import { Collection, JSCodeshift } from "jscodeshift";

import { addClientImportEquals } from "./addClientImportEquals";
import { addClientImports } from "./addClientImports";
import { addClientRequires } from "./addClientRequires";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { ClientModulesOptions } from "./types";

export const addClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void =>
  hasRequire(j, source)
    ? addClientRequires(j, source, options)
    : hasImportEquals(j, source)
    ? addClientImportEquals(j, source, options)
    : addClientImports(j, source, options);
