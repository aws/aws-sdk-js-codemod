import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientNewExpression } from "../get";

export interface ReplaceClientCreationOptions {
  v2ClientName: string;
  v2GlobalName: string;
  v3ClientName: string;
}

// Replace v2 client creation with v3 client creation.
export const replaceClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2GlobalName, v3ClientName }: ReplaceClientCreationOptions
): void => {
  source
    .find(j.NewExpression, getV2ClientNewExpression({ v2GlobalName, v2ClientName }))
    .replaceWith((v2ClientNewExpression) =>
      j.newExpression(j.identifier(v3ClientName), v2ClientNewExpression.node.arguments)
    );
};
