import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

export const getV2DefaultModuleName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined =>
  containsRequire(j, source)
    ? getRequireIdentifierName(j, source, "aws-sdk")
    : getImportIdentifierName(j, source, "aws-sdk");
