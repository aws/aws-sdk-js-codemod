import { Collection, JSCodeshift } from "jscodeshift";
import { AWS_CREDENTIALS_MAP } from "../config";
import { ImportType, addNamedModule } from "../modules";
import { getAwsCredentialsNewExpressions } from "./getAwsCredentialsNewExpressions";

export interface ReplaceAwsCredentialsOptions {
  v2GlobalName?: string;
  importType: ImportType;
}

export const replaceAwsCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, importType }: ReplaceAwsCredentialsOptions
) => {
  if (!v2GlobalName) return;

  for (const [v2CredentialsName, v3ProviderName] of Object.entries(AWS_CREDENTIALS_MAP)) {
    const credsNewExpressions = getAwsCredentialsNewExpressions(j, source, {
      v2GlobalName,
      className: v2CredentialsName,
    });
    const credsNewExpressionCount = credsNewExpressions.size();

    if (credsNewExpressionCount > 0) {
      addNamedModule(j, source, {
        importType,
        importedName: v3ProviderName,
        packageName: "@aws-sdk/credential-providers",
      });
      credsNewExpressions.replaceWith(({ node }) =>
        j.callExpression.from({
          callee: j.identifier(v3ProviderName),
          comments: [
            j.commentLine(
              " JS SDK v3 switched to credential providers to functions instead of objects."
            ),
            j.commentLine(
              " This is the closest approximation from codemod of what your application needs."
            ),
            j.commentLine(
              " Reference: https://www.npmjs.com/package/@aws-sdk/credential-providers"
            ),
          ],
          arguments: node.arguments,
        })
      );
    }
  }
};
