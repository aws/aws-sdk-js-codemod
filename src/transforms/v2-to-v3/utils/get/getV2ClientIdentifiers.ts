import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientIdNamesFromNewExpr } from "./getV2ClientIdNamesFromNewExpr";
import { getV2ClientIdNamesFromTSTypeRef } from "./getV2ClientIdNamesFromTSTypeRef";

export interface GetV2ClientIdNamesOptions {
  v2ClientName: string;
  v2GlobalName: string;
}

export const getV2ClientIdentifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, v2ClientName }: GetV2ClientIdNamesOptions
): Identifier[] => {
  const v2ClientIdNamesFromNewExpr = getV2ClientIdNamesFromNewExpr(j, source, {
    v2GlobalName,
    v2ClientName,
  });

  const v2ClientIdNamesFromTSTypeRef = getV2ClientIdNamesFromTSTypeRef(j, source, {
    v2GlobalName,
    v2ClientName,
  });

  const clientIdNames = getMergedArrayWithoutDuplicates(
    v2ClientIdNamesFromNewExpr,
    v2ClientIdNamesFromTSTypeRef
  );

  return clientIdNames.map((clientidName) => ({ type: "Identifier", name: clientidName }));
};
