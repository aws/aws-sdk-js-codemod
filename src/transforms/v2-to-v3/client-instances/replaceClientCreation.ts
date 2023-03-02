import { Collection, JSCodeshift } from "jscodeshift";

import { getClientNewExpression } from "../utils";

export interface ReplaceClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName: string;
}

// Replace v2 client creation with v3 client creation.
export const replaceClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ReplaceClientCreationOptions
): void => {
  source
    .find(j.NewExpression, getClientNewExpression({ v2GlobalName, v2ClientName }))
    .replaceWith((v2ClientNewExpression) =>
      j.newExpression(j.identifier(v2ClientLocalName), v2ClientNewExpression.node.arguments)
    );
};
