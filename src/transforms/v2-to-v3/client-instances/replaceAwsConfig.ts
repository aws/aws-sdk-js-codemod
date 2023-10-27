import { Collection, JSCodeshift, ObjectExpression } from "jscodeshift";
import { getObjectWithUpdatedAwsConfigKeys } from "./getObjectWithUpdatedAwsConfigKeys";

export const replaceAwsConfig = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
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
      ({ node }) => node.arguments.length === 1 && node.arguments[0].type === "ObjectExpression"
    )
    .replaceWith(({ node }) =>
      getObjectWithUpdatedAwsConfigKeys(j, node.arguments[0] as ObjectExpression)
    );
};
