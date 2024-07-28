import type { Collection, JSCodeshift, MemberExpression, ObjectExpression } from "jscodeshift";

const getUnsupportedComments = (): string[] => [
  " JS SDK v3 does not support global configuration.",
  " Codemod has attempted to pass values to each service client in this file.",
  " You may need to update clients outside of this file, if they use global config.",
];

export const getAwsGlobalConfig = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
): ObjectExpression => {
  const objectExpression = j.objectExpression([]);

  if (!v2GlobalName) return objectExpression;

  // Get config from AWS.config.update({ ... })
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
    .forEach((callExpression) => {
      const node = callExpression.node;
      if (node.arguments.length !== 1 || node.arguments[0].type !== "ObjectExpression") {
        return;
      }

      const objectExpressionProperties = node.arguments[0].properties;
      objectExpressionProperties.forEach((property) => {
        objectExpression.properties.push(property);
      });

      const comments = node.comments || [];
      for (const comment of getUnsupportedComments()) {
        comments.push(j.commentLine(comment));
      }
      node.comments = comments;
    });

  // Get config from AWS.config.key = value
  source
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        object: {
          type: "MemberExpression",
          object: { type: "Identifier", name: v2GlobalName },
          property: { type: "Identifier", name: "config" },
        },
        property: { type: "Identifier" },
      },
    })
    .forEach(({ node }) => {
      objectExpression.properties.push(
        j.objectProperty((node.left as MemberExpression).property, node.right)
      );

      const comments = node.comments || [];
      for (const comment of getUnsupportedComments()) {
        comments.push(j.commentLine(comment));
      }
      node.comments = comments;
    });

  return objectExpression;
};
