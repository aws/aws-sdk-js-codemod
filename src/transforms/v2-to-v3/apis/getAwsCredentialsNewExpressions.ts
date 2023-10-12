import { Collection, JSCodeshift } from "jscodeshift";

export interface GetAwsCredentialsNewExpressionOptions {
  v2GlobalName: string;
  className: string;
}

export const getAwsCredentialsNewExpressions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, className }: GetAwsCredentialsNewExpressionOptions
) =>
  source.find(j.NewExpression, {
    type: "NewExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: v2GlobalName,
      },
      property: { name: className },
    },
  });
