import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";

export interface GetV2ClientNamesOptions {
  v2DefaultModuleName: string;
  v2ServiceModuleNames: string[];
}

export const getV2ClientNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ServiceModuleNames }: GetV2ClientNamesOptions
): string[] => {
  const v2ClientNamesFromNewExpr = getV2ClientNamesFromNewExpr(j, source, v2DefaultModuleName);

  return getMergedArrayWithoutDuplicates(v2ClientNamesFromNewExpr, v2ServiceModuleNames);
};
