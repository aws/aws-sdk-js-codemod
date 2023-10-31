import { Collection, JSCodeshift, ObjectExpression } from "jscodeshift";

export const getAwsGlobalConfig = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
): ObjectExpression => {
  const objectExpression = j.objectExpression([]);

  if (!v2GlobalName) return objectExpression;

  source
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          type: "MemberExpression",
          object: { type: "Identifier", name: v2GlobalName },
          property: { type: "Identifier", name: "config" },
        },
        property: { type: "Identifier", name: "update" },
      },
    })
    .filter(
      ({ node }) => node.arguments.length === 1 && node.arguments[0].type === "ObjectExpression"
    )
    .forEach(({ node }) => {
      const objectExpressionProperties = (node.arguments[0] as ObjectExpression).properties;

      objectExpressionProperties.forEach((property) => {
        objectExpression.properties.push(property);
      });
    });

  return objectExpression;
};
