import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "../containsRequire";
import { addV3ClientImport } from "./addV3ClientImport";
import { addV3ClientRequires } from "./addV3ClientRequires";

export interface AddV3ClientModuleOptions {
  v2ClientName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
  v2DefaultModuleName: string;
}

export const addV3ClientModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: AddV3ClientModuleOptions
): void =>
  containsRequire(j, source)
    ? addV3ClientRequires(j, source, options)
    : addV3ClientImport(j, source, options);
