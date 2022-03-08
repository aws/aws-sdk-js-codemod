import { Collection, JSCodeshift } from "jscodeshift";

import { addV3ClientImport } from "./addV3ClientImport";
import { addV3ClientRequire } from "./addV3ClientRequire";
import { containsRequire } from "./containsRequire";

export interface AddV3ClientModuleOptions {
  v2ClientName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}

export const addV3ClientModule = (
  j: JSCodeshift,
  source: Collection<any>,
  { v2ClientName, v3ClientName, v3ClientPackageName }: AddV3ClientModuleOptions
): void =>
  containsRequire(j, source)
    ? addV3ClientRequire(j, source, { v2ClientName, v3ClientName, v3ClientPackageName })
    : addV3ClientImport(j, source, { v2ClientName, v3ClientName, v3ClientPackageName });
