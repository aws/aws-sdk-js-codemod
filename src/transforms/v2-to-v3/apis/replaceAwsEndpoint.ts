import { Collection, JSCodeshift } from "jscodeshift";

export const replaceAwsEndpoint = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  const endpointCtr = "Endpoint";

  if (v2GlobalName) {
    source
      .find(j.NewExpression, {
        callee: {
          type: "MemberExpression",
          object: { type: "Identifier", name: v2GlobalName },
          property: { type: "Identifier", name: endpointCtr },
        },
      })
      .replaceWith((newExpression) =>
        j.newExpression(j.identifier("URL"), newExpression.node.arguments)
      );
  }

  source
    .find(j.NewExpression, {
      callee: { type: "Identifier", name: endpointCtr },
    })
    .replaceWith((newExpression) =>
      j.newExpression(j.identifier("URL"), newExpression.node.arguments)
    );
};
