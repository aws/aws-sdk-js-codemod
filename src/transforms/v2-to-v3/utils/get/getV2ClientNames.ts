import { Collection, JSCodeshift } from "jscodeshift";

import { DYNAMODB_CLIENT_NAME, DYNAMODB_DOCUMENT_CLIENT_NAME } from "../config";
import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientNamesFromNewExpr } from "./getV2ClientNamesFromNewExpr";
import { getV2ClientNamesFromTSTypeRef } from "./getV2ClientNamesFromTSTypeRef";

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
  const v2ClientNamesFromTSTypeRef = getV2ClientNamesFromTSTypeRef(j, source, v2DefaultModuleName);

  const v2ClientNames = getMergedArrayWithoutDuplicates(
    getMergedArrayWithoutDuplicates(v2ClientNamesFromNewExpr, v2ClientNamesFromTSTypeRef),
    v2ServiceModuleNames
  );

  if (
    v2ClientNames.includes(DYNAMODB_DOCUMENT_CLIENT_NAME) &&
    !v2ClientNames.includes(DYNAMODB_CLIENT_NAME)
  ) {
    v2ClientNames.push(DYNAMODB_CLIENT_NAME);
  }

  return v2ClientNames;
};
