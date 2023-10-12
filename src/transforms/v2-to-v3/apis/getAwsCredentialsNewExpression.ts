import { Collection, JSCodeshift } from "jscodeshift";

export interface GetAwsCredentialsNewExpressionOptions {
  v2GlobalName: string;
  functionName: string;
}

export const getAwsCredentialsNewExpression = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, functionName }: GetAwsCredentialsNewExpressionOptions
) =>
  source.find(j.NewExpression, {
    type: "NewExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: v2GlobalName,
      },
      property: { name: functionName },
    },
  });
