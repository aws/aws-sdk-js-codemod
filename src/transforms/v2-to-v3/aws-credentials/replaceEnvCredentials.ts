import { Collection, JSCodeshift } from "jscodeshift";

import { getAwsCredentialsNewExpression } from "./getAwsCredentialsNewExpression";

export const replaceEnvCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  const functionName = "EnvironmentCredentials";
  getAwsCredentialsNewExpression(j, source, { v2GlobalName, functionName }).replaceWith(
    ({ node }) => j.callExpression(j.identifier("fromEnv"), node.arguments)
  );
};
