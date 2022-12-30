import { Collection, JSCodeshift } from "jscodeshift";

import { hasRequire } from "../has";
import { ClientCodemodOptions } from "../types";
import { addV3ClientImports } from "./addV3ClientImports";
import { addV3ClientRequires } from "./addV3ClientRequires";

export const addV3ClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientCodemodOptions: ClientCodemodOptions
): void =>
  hasRequire(j, source)
    ? addV3ClientRequires(j, source, clientCodemodOptions)
    : addV3ClientImports(j, source, clientCodemodOptions);
