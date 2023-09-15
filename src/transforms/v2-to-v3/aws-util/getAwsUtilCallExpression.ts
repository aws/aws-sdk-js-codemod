import { Collection, JSCodeshift } from "jscodeshift";

export interface GetAwsUtilCallExpressionOptions {
  v2GlobalName: string;
  functionName: string;
}

export const getAwsUtilCallExpression = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, functionName }: GetAwsUtilCallExpressionOptions
) =>
  source.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: v2GlobalName,
        },
        property: { name: "util" },
      },
      property: { name: functionName },
    },
  });
