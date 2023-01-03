import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";
import { getV2ClientNamesFromTSQualifiedName } from "./getV2ClientNamesFromTSQualifiedName";

export const getV2ClientNamesFromGlobal = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => {
  const namesFromNewExpr = getV2ClientNamesFromNewExpr(j, source, v2GlobalName);
  const namesFromTSQualifiedName = getV2ClientNamesFromTSQualifiedName(j, source, v2GlobalName);
  return [...new Set([...namesFromNewExpr, ...namesFromTSQualifiedName])];
};
