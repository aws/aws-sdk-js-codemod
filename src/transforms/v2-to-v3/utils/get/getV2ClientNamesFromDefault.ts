import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";
import { getV2ClientNamesFromTSTypeRef } from "./getV2ClientNamesFromTSTypeRef";

export const getV2ClientNamesFromDefault = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2DefaultModuleName: string
): string[] => {
  const v2ClientNamesFromNewExpr = getV2ClientNamesFromNewExpr(j, source, v2DefaultModuleName);
  const v2ClientNamesFromTSTypeRef = getV2ClientNamesFromTSTypeRef(j, source, v2DefaultModuleName);

  return getMergedArrayWithoutDuplicates(v2ClientNamesFromNewExpr, v2ClientNamesFromTSTypeRef);
};
