import { NewExpression } from "jscodeshift";

export interface ClientNewExpressionOptions {
  v2ClientLocalName?: string;
  v2ClientName?: string;
  v2GlobalName?: string;
}

export const getClientNewExpression = ({
  v2ClientLocalName,
  v2ClientName,
  v2GlobalName,
}: ClientNewExpressionOptions): NewExpression => {
  if (!v2GlobalName && !v2ClientLocalName) {
    throw new Error(
      `One of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName && v2ClientLocalName) {
    throw new Error(
      `Only one of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName) {
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
          type: "MemberExpression",
          object: { type: "Identifier", name: v2GlobalName },
          property: { type: "Identifier", name: clientName },
        },
      } as NewExpression;
    }

    return {
      type: "NewExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: v2GlobalName },
        property: { type: "Identifier" },
      },
    } as NewExpression;
  }

  // Support for DynamoDB.DocumentClient
  const [clientName, subClientName] = v2ClientLocalName!.split(".");

  if (subClientName) {
    return {
      type: "NewExpression",
      callee: {
        type: "MemberExpression",
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
