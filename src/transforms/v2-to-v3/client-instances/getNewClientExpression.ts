import type { ASTPath, JSCodeshift, NewExpression, ObjectExpression } from "jscodeshift";
import { getObjectWithUpdatedAwsConfigKeys } from "./getObjectWithUpdatedAwsConfigKeys";

export interface GetNewClientExpressionOptions {
  v2ClientNewExpression: ASTPath<NewExpression>;
  awsGlobalConfig: ObjectExpression;
}

export const getNewClientExpression = (
  j: JSCodeshift,
  clientName: string,
  { v2ClientNewExpression, awsGlobalConfig }: GetNewClientExpressionOptions
) => {
  const newClientArguments = [];

  const v2ClientArguments = v2ClientNewExpression.node.arguments;

  if (v2ClientArguments.length === 0 && awsGlobalConfig.properties.length > 0) {
    newClientArguments.push(
      getObjectWithUpdatedAwsConfigKeys(j, j.objectExpression([]), awsGlobalConfig)
    );
  } else if (v2ClientArguments.length === 1 && v2ClientArguments[0].type === "ObjectExpression") {
    newClientArguments.push(
      getObjectWithUpdatedAwsConfigKeys(j, v2ClientArguments[0], awsGlobalConfig)
    );
  } else {
    newClientArguments.push(...v2ClientArguments);
  }

  return j.newExpression(j.identifier(clientName), newClientArguments);
};
