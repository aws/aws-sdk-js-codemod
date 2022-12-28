import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";
import { getV2ClientNamesFromTSTypeRef } from "./getV2ClientNamesFromTSTypeRef";

export const getV2ClientNamesFromDefault = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => {
  const v2ClientNamesFromNewExpr = getV2ClientNamesFromNewExpr(j, source, v2GlobalName);
  const v2ClientNamesFromTSTypeRef = getV2ClientNamesFromTSTypeRef(j, source, v2GlobalName);

  return getMergedArrayWithoutDuplicates(v2ClientNamesFromNewExpr, v2ClientNamesFromTSTypeRef);
};
