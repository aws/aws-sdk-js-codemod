import { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";
import { getObjectWithUpdatedAwsConfigKeys } from "./getObjectWithUpdatedAwsConfigKeys";

export const getNewClientExpression = (
  j: JSCodeshift,
  clientName: string,
  v2ClientNewExpression: ASTPath<NewExpression>
) => {
  const newClientArguments = [];

  const v2ClientArguments = v2ClientNewExpression.node.arguments;
  if (v2ClientArguments.length === 1 && v2ClientArguments[0].type === "ObjectExpression") {
    newClientArguments.push(getObjectWithUpdatedAwsConfigKeys(j, v2ClientArguments[0]));
  } else {
    newClientArguments.push(...v2ClientArguments);
  }

  return j.newExpression(j.identifier(clientName), newClientArguments);
};
