import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientIdNamesFromNewExpr } from "./getV2ClientIdNamesFromNewExpr";
import { getV2ClientIdNamesFromTSTypeRef } from "./getV2ClientIdNamesFromTSTypeRef";

export interface GetV2ClientIdentifiersOptions {
  v2ClientName: string;
  v2GlobalName?: string;
}

export const getV2ClientIdentifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientIdentifiersOptions
): Identifier[] => {
  const namesFromNewExpr = getV2ClientIdNamesFromNewExpr(j, source, options);
  const namesFromTSTypeRef = getV2ClientIdNamesFromTSTypeRef(j, source, options);
  const clientIdNames = getMergedArrayWithoutDuplicates(namesFromNewExpr, namesFromTSTypeRef);
  return clientIdNames.map((clientidName) => ({ type: "Identifier", name: clientidName }));
};
