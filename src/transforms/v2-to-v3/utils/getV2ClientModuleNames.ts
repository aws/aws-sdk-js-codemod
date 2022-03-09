import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "./config";
import { containsRequire } from "./containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";
import { getV2ClientModulePath } from "./getV2ClientModulePath";

export const getV2ClientModuleNames = (j: JSCodeshift, source: Collection<unknown>): string[] =>
  CLIENT_NAMES.map((clientName) =>
    containsRequire(j, source)
      ? getRequireIdentifierName(j, source, getV2ClientModulePath(clientName))
      : getImportIdentifierName(j, source, getV2ClientModulePath(clientName))
  ).filter((v2ClientModuleName) => v2ClientModuleName !== undefined);
