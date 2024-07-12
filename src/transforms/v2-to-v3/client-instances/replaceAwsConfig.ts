import type { Collection, JSCodeshift, ObjectExpression } from "jscodeshift";
import { getObjectWithUpdatedAwsConfigKeys } from "./getObjectWithUpdatedAwsConfigKeys";

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
    .filter(
      ({ node }) =>
        node.arguments.length === 0 ||
        (node.arguments.length === 1 && node.arguments[0].type === "ObjectExpression")
    )
    .replaceWith(({ node }) => {
      const objectExpression =
        node.arguments.length === 0
          ? j.objectExpression([])
          : (node.arguments[0] as ObjectExpression);
      return getObjectWithUpdatedAwsConfigKeys(j, objectExpression, awsGlobalConfig);
    });
};
