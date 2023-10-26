import { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";

export const getNewClientExpression = (
  j: JSCodeshift,
  clientName: string,
  v2ClientNewExpression: ASTPath<NewExpression>
) => j.newExpression(j.identifier(clientName), v2ClientNewExpression.node.arguments);
