import { Collection, JSCodeshift } from "jscodeshift";

import { hasRequire } from "../hasRequire";
import { addV3ClientImports } from "./addV3ClientImports";
import { addV3ClientRequires } from "./addV3ClientRequires";

export interface AddV3ClientModulesOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}

export const addV3ClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: AddV3ClientModulesOptions
): void =>
  hasRequire(j, source)
    ? addV3ClientRequires(j, source, options)
    : addV3ClientImports(j, source, options);
