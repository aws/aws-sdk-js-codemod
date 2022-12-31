import { Collection, JSCodeshift } from "jscodeshift";

import { addV3ClientImports } from "./addV3ClientImports";
import { addV3ClientRequires } from "./addV3ClientRequires";
import { hasRequire } from "./hasRequire";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void =>
  hasRequire(j, source)
    ? addV3ClientRequires(j, source, options)
    : addV3ClientImports(j, source, options);
