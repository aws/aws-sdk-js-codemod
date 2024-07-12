import type { Collection, JSCodeshift, NewExpression } from "jscodeshift";
import { AWS_CREDENTIALS_MAP, AWS_TOKEN_MAP } from "../config";
import { type ImportType, addNamedModule } from "../modules";

export interface ReplaceAwsCredentialsOptions {
  v2GlobalName?: string;
  importType: ImportType;
}

const getNewExpression = (className: string, identifier?: string) =>
  ({
    type: "NewExpression",
    callee: {
      ...(identifier
        ? {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: identifier,
            },
            property: { name: className },
          }
        : {
            type: "Identifier",
            name: className,
          }),
    },
  }) as NewExpression;

export const replaceAwsIdentity = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, importType }: ReplaceAwsCredentialsOptions
) => {
  for (const [identity, identityMap] of Object.entries({
    Credential: AWS_CREDENTIALS_MAP,
    Token: AWS_TOKEN_MAP,
  })) {
    const identitySwitchComment = ` JS SDK v3 switched ${identity.toLowerCase()} providers from classes to functions.`;
    const identityPackageName = `@aws-sdk/${identity.toLowerCase()}-providers`;

    const identityProviderChain = `${identity}ProviderChain`;
    const chainNewExpressions = source.find(
      j.NewExpression,
      getNewExpression(identityProviderChain, v2GlobalName)
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

    for (const [v2IdentityName, v3ProviderName] of Object.entries(identityMap)) {
      const credsNewExpressions = source.find(
        j.NewExpression,
        getNewExpression(v2IdentityName, v2GlobalName)
      );

      if (credsNewExpressions.size() > 0) {
        addNamedModule(j, source, {
          importType,
          localName: v3ProviderName,
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
  }
};
