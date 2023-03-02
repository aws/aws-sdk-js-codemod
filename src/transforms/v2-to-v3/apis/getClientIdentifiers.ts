import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getClientIdThisExpressions, ThisMemberExpression } from "./getClientIdThisExpressions";
import { getV2ClientIdNamesFromNewExpr } from "./getV2ClientIdNamesFromNewExpr";
import { getV2ClientIdNamesFromTSTypeRef } from "./getV2ClientIdNamesFromTSTypeRef";

export interface GetClientIdentifiersOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export type ClientIdentifier = Identifier | ThisMemberExpression;

export const getClientIdentifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetClientIdentifiersOptions
): ClientIdentifier[] => {
  const namesFromNewExpr = getV2ClientIdNamesFromNewExpr(j, source, options);
  const namesFromTSTypeRef = getV2ClientIdNamesFromTSTypeRef(j, source, options);
  const clientIdNames = [...new Set([...namesFromNewExpr, ...namesFromTSTypeRef])];

  const clientIdentifiers: Identifier[] = clientIdNames.map((clientidName) => ({
    type: "Identifier",
    name: clientidName,
  }));
  const clientIdThisExpressions = getClientIdThisExpressions(j, source, clientIdentifiers);

  return [...clientIdentifiers, ...clientIdThisExpressions];
};
