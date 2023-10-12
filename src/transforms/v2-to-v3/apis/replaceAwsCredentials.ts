import { Collection, JSCodeshift } from "jscodeshift";
import { getAwsCredentialsNewExpression } from "./getAwsCredentialsNewExpression";

export const replaceAwsCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  const functionName = "EnvironmentCredentials";
  getAwsCredentialsNewExpression(j, source, { v2GlobalName, functionName }).replaceWith(
    ({ node }) => j.callExpression(j.identifier("fromEnv"), node.arguments)
  );
};
