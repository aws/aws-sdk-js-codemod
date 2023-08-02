import { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";
import { getDynamoDBForDocClient } from "./getDynamoDBForDocClient";

export interface GetDynamoDBDocClientArgsOptions {
  v2ClientLocalName?: string;
}

export const getDynamoDBDocClientArgs = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  options: GetDynamoDBDocClientArgsOptions
) => [getDynamoDBForDocClient(j, v2DocClientNewExpression, options)];
