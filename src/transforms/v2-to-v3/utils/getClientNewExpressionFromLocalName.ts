import type { NewExpression } from "jscodeshift";

export const getClientNewExpressionFromLocalName = (v2ClientLocalName: string): NewExpression => {
  // Support for DynamoDB.DocumentClient
  const [clientName, subClientName] = v2ClientLocalName!.split(".");

  if (subClientName) {
    return {
      type: "NewExpression",
      callee: {
        object: { type: "Identifier", name: clientName },
        property: { type: "Identifier", name: subClientName },
      },
    } as NewExpression;
  }

  return {
    type: "NewExpression",
    callee: { type: "Identifier", name: clientName },
  } as NewExpression;
};
