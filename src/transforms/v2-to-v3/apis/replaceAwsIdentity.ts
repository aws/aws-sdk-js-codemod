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

  const identity = "Credential";
  const identityMap = AWS_CREDENTIALS_MAP;

  const identitySwitchComment = ` JS SDK v3 switched ${identity.toLowerCase()} providers from classes to functions.`;
  const identityPackageName = `@aws-sdk/${identity.toLowerCase()}-providers`;

  // ToDo: Add support for AWS.TokenProviderChain in future.
  const identityProviderChain = `${identity}ProviderChain`;
  const chainNewExpressions = source.find(
    j.NewExpression,
    getNewExpression(v2GlobalName, identityProviderChain)
  );
  if (chainNewExpressions.size() > 0) {
    const localName = "providerChain";
    addNamedModule(j, source, {
      importType,
      localName,
      importedName: "chain",
      packageName: "@smithy/property-provider",
    });
    chainNewExpressions.replaceWith(({ node }) =>
      j.callExpression.from({
        callee: j.identifier(localName),
        comments: [
          j.commentLine(identitySwitchComment),
          j.commentLine(` The ${identityProviderChain} is now a chain of providers.`),
          j.commentLine(` Reference: https://www.npmjs.com/package/${identityPackageName}`),
        ],
        arguments: node.arguments,
      })
    );
  }

  // ToDo: Add support for AWS.Token in future.
  for (const [v2IdentityName, v3ProviderName] of Object.entries(identityMap)) {
    const credsNewExpressions = source.find(
      j.NewExpression,
      getNewExpression(v2GlobalName, v2IdentityName)
    );

    if (credsNewExpressions.size() > 0) {
      addNamedModule(j, source, {
        importType,
        importedName: v3ProviderName,
        packageName: identityPackageName,
      });
      credsNewExpressions.replaceWith(({ node }) =>
        j.callExpression.from({
          callee: j.identifier(v3ProviderName),
          comments: [
            j.commentLine(identitySwitchComment),
            j.commentLine(
              " This is the closest approximation from codemod of what your application needs."
            ),
            j.commentLine(` Reference: https://www.npmjs.com/package/${identityPackageName}`),
          ],
          arguments: node.arguments,
        })
      );
    }
  }
};
