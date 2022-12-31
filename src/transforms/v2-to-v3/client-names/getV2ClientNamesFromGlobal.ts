import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";
import { getV2ClientNamesFromTSTypeRef } from "./getV2ClientNamesFromTSTypeRef";

export const getV2ClientNamesFromGlobal = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => {
  const namesFromNewExpr = getV2ClientNamesFromNewExpr(j, source, v2GlobalName);
  const namesFromTSTypeRef = getV2ClientNamesFromTSTypeRef(j, source, v2GlobalName);
  return [...new Set([...namesFromNewExpr, ...namesFromTSTypeRef])];
};
