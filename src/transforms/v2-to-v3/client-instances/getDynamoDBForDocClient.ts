import { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";

import { DYNAMODB } from "../config";

export interface GetDynamoDBForDocClientOptions {
  v2ClientLocalName?: string;
}

export const getDynamoDBForDocClient = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  { v2ClientLocalName }: GetDynamoDBForDocClientOptions
) =>
  j.newExpression(
    v2ClientLocalName ? j.identifier(v2ClientLocalName) : j.identifier(DYNAMODB),
    v2DocClientNewExpression.node.arguments
  );
