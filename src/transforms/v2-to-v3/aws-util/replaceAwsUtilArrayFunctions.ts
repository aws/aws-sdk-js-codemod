import { Collection, FunctionExpression, Identifier, JSCodeshift } from "jscodeshift";

export const replaceAwsUtilArrayFunctions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  // replace arrayEach
  source
    .find(j.CallExpression, {
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
        property: { name: "arrayEach" },
      },
    })
    .filter(({ node }) => node.arguments.length === 2)
    .replaceWith(({ node }) => {
      const array = node.arguments[0] as Identifier;
      const iteratee = node.arguments[1] as FunctionExpression;
      return j.callExpression(j.memberExpression(array, j.identifier("forEach")), [iteratee]);
    });
};
