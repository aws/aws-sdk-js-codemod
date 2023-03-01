import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getV2ClientIdNamesFromNewExpr } from "./getV2ClientIdNamesFromNewExpr";
import { getV2ClientIdNamesFromTSTypeRef } from "./getV2ClientIdNamesFromTSTypeRef";
import { getV2ClientIdThisExpressions, ThisMemberExpression } from "./getV2ClientIdThisExpressions";

export interface GetV2ClientIdentifiersOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export type V2ClientIdentifier = Identifier | ThisMemberExpression;

export const getV2ClientIdentifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientIdentifiersOptions
): V2ClientIdentifier[] => {
  const namesFromNewExpr = getV2ClientIdNamesFromNewExpr(j, source, options);
  const namesFromTSTypeRef = getV2ClientIdNamesFromTSTypeRef(j, source, options);
  const clientIdNames = [...new Set([...namesFromNewExpr, ...namesFromTSTypeRef])];

  const v2ClientIdentifiers: Identifier[] = clientIdNames.map((clientidName) => ({
    type: "Identifier",
    name: clientidName,
  }));
  const v2ClientIdThisExpressions = getV2ClientIdThisExpressions(j, source, v2ClientIdentifiers);

  return [...v2ClientIdentifiers, ...v2ClientIdThisExpressions];
};
