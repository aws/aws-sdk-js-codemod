import { Collection, JSCodeshift } from "jscodeshift";

import { DYNAMODB } from "../config";
import { getDocClientNewExpression } from "../utils";
import { getDynamoDBForDocClient } from "./getDynamoDBForDocClient";

export interface ReplaceDocClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const replaceDocClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ReplaceDocClientCreationOptions
): void => {
  if (v2ClientName !== DYNAMODB) return;

  if (v2GlobalName) {
    source
      .find(j.NewExpression, getDocClientNewExpression({ v2GlobalName }))
      .replaceWith((v2DocClientNewExpression) =>
        j.callExpression(
          j.memberExpression(j.identifier("DynamoDBDocument"), j.identifier("from")),
          [getDynamoDBForDocClient(j, v2DocClientNewExpression, { v2ClientLocalName })]
        )
      );
  }

  source
    .find(j.NewExpression, getDocClientNewExpression({ v2ClientLocalName }))
    .replaceWith((v2DocClientNewExpression) =>
      j.callExpression(j.memberExpression(j.identifier("DynamoDBDocument"), j.identifier("from")), [
        getDynamoDBForDocClient(j, v2DocClientNewExpression, { v2ClientLocalName }),
      ])
    );
};
