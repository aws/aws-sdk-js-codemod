import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "../config";
import { containsRequire } from "../containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export const getV2ServiceModuleNames = (j: JSCodeshift, source: Collection<unknown>): string[] =>
  CLIENT_NAMES.map((clientName) =>
    containsRequire(j, source)
      ? (getRequireIdentifierName(j, source, getV2ServiceModulePath(clientName)) as string)
      : (getImportIdentifierName(j, source, getV2ServiceModulePath(clientName)) as string)
  ).filter((v2ServiceModuleName) => v2ServiceModuleName !== undefined);
