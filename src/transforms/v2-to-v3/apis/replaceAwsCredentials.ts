import { Collection, JSCodeshift } from "jscodeshift";
import { AWS_CREDENTIALS_MAP } from "../config";
import { getAwsCredentialsNewExpression } from "./getAwsCredentialsNewExpression";

export const replaceAwsCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  for (const [v2CredentialsName, v3ProviderName] of Object.entries(AWS_CREDENTIALS_MAP)) {
    getAwsCredentialsNewExpression(j, source, {
      v2GlobalName,
      className: v2CredentialsName,
    }).replaceWith(({ node }) => j.callExpression(j.identifier(v3ProviderName), node.arguments));
  }
};
