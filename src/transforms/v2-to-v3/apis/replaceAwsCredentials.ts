import { Collection, JSCodeshift } from "jscodeshift";
import { AWS_CREDENTIALS_MAP } from "../config";
import { getAwsCredentialsNewExpressions } from "./getAwsCredentialsNewExpressions";

export const replaceAwsCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  for (const [v2CredentialsName, v3ProviderName] of Object.entries(AWS_CREDENTIALS_MAP)) {
    const credsNewExpressions = getAwsCredentialsNewExpressions(j, source, {
      v2GlobalName,
      className: v2CredentialsName,
    });
    const credsNewExpressionCount = credsNewExpressions.size();

    if (credsNewExpressionCount > 0) {
      // addClientNamedModule(j, source, {
      //   ...options,
      //   importedName: v3ProviderName,
      //   v3ClientPackageName: "@aws-sdk/credential-provider",
      // });
      credsNewExpressions.replaceWith(({ node }) =>
        j.callExpression(j.identifier(v3ProviderName), node.arguments)
      );
    }
  }
};
