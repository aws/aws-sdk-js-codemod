import type { Collection, JSCodeshift, ObjectExpression } from "jscodeshift";
import { getObjectWithUpdatedAwsConfigKeys } from "./getObjectWithUpdatedAwsConfigKeys.ts";

export interface ReplaceAwsConfigOptions {
  v2GlobalName?: string;
  awsGlobalConfig: ObjectExpression;
}

export const replaceAwsConfig = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, awsGlobalConfig }: ReplaceAwsConfigOptions
) => {
  if (!v2GlobalName) return;

  source
    .find(j.NewExpression, {
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: v2GlobalName },
        property: { type: "Identifier", name: "Config" },
      },
    })
    .replaceWith((newExpression) => {
      const nodeArguments = newExpression.node.arguments;

      if (nodeArguments.length === 0) {
        return getObjectWithUpdatedAwsConfigKeys(j, j.objectExpression([]), awsGlobalConfig);
      }
      if (nodeArguments.length === 1 && nodeArguments[0].type === "ObjectExpression") {
        return getObjectWithUpdatedAwsConfigKeys(j, nodeArguments[0], awsGlobalConfig);
      }

      return newExpression;
    });
};
