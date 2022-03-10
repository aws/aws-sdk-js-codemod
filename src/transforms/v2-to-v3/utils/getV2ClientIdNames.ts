import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientIdNamesFromNewExpr } from "./getV2ClientIdNamesFromNewExpr";
import { getV2ClientIdNamesFromTSTypeRef } from "./getV2ClientIdNamesFromTSTypeRef";

export interface GetV2ClientIdNamesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

export const getV2ClientIdNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: GetV2ClientIdNamesOptions
): string[] => {
  const v2ClientIdNamesFromNewExpr = getV2ClientIdNamesFromNewExpr(j, source, {
    v2DefaultModuleName,
    v2ClientName,
  });

  const v2ClientIdNamesFromTSTypeRef = getV2ClientIdNamesFromTSTypeRef(j, source, {
    v2DefaultModuleName,
    v2ClientName,
  });

  return getMergedArrayWithoutDuplicates(v2ClientIdNamesFromNewExpr, v2ClientIdNamesFromTSTypeRef);
};
