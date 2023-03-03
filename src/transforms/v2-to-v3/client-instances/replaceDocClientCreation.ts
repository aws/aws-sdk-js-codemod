import { Collection, JSCodeshift } from "jscodeshift";

import { DYNAMODB } from "../config";
import { getDocClientNewExpression } from "../utils";

export interface ReplaceDocClientCreationOptions {
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const replaceDocClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2GlobalName }: ReplaceDocClientCreationOptions
): void => {
  if (v2GlobalName) {
    source
      .find(j.NewExpression, getDocClientNewExpression({ v2GlobalName }))
      .replaceWith((v2DocClientNewExpression) =>
        j.callExpression(
          j.memberExpression(j.identifier("DynamoDBDocument"), j.identifier("from")),
          [j.newExpression(j.identifier(DYNAMODB), v2DocClientNewExpression.node.arguments)]
        )
      );
  }

  source
    .find(j.NewExpression, getDocClientNewExpression({ v2ClientLocalName }))
    .replaceWith((v2DocClientNewExpression) =>
      j.callExpression(j.memberExpression(j.identifier("DynamoDBDocument"), j.identifier("from")), [
        j.newExpression(j.identifier(v2ClientLocalName), v2DocClientNewExpression.node.arguments),
      ])
    );
};
