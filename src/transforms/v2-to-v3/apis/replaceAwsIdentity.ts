import { Collection, JSCodeshift, NewExpression } from "jscodeshift";
import { AWS_CREDENTIALS_MAP } from "../config";
import { ImportType, addNamedModule } from "../modules";

export interface ReplaceAwsCredentialsOptions {
  v2GlobalName?: string;
  importType: ImportType;
}

const getNewExpression = (identifier: string, className: string) =>
  ({
    type: "NewExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: identifier,
      },
      property: { name: className },
    },
  }) as NewExpression;

export const replaceAwsIdentity = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, importType }: ReplaceAwsCredentialsOptions
) => {
  if (!v2GlobalName) return;

  // ToDo: Add support for AWS.Token in future.
  for (const [v2CredentialsName, v3ProviderName] of Object.entries(AWS_CREDENTIALS_MAP)) {
    const credsNewExpressions = source.find(
      j.NewExpression,
      getNewExpression(v2GlobalName, v2CredentialsName)
    );

    if (credsNewExpressions.size() > 0) {
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
