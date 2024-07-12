import type { NewExpression } from "jscodeshift";

export const getClientNewExpressionFromGlobalName = (
  v2GlobalName: string,
  v2ClientName?: string
): NewExpression => {
  if (v2ClientName) {
    // Support for DynamoDB.DocumentClient
    const [clientName, subClientName] = v2ClientName.split(".");

    if (subClientName) {
      return {
        type: "NewExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: { type: "Identifier", name: v2GlobalName },
            property: { type: "Identifier", name: clientName },
          },
          property: { type: "Identifier", name: subClientName },
        },
      } as NewExpression;
    }

    return {
      type: "NewExpression",
      callee: {
        object: { type: "Identifier", name: v2GlobalName },
        property: { type: "Identifier", name: clientName },
      },
    } as NewExpression;
  }

  return {
    type: "NewExpression",
    callee: {
      object: { type: "Identifier", name: v2GlobalName },
      property: { type: "Identifier" },
    },
  } as NewExpression;
};
