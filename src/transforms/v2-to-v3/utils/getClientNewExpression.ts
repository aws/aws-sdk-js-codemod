import { NewExpression } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB_DOCUMENT_CLIENT } from "../config";

export interface GetClientNewExpressionOptions {
  v2ClientLocalName?: string;
  v2ClientName?: string;
  v2GlobalName?: string;
}

export const getClientNewExpression = ({
  v2ClientLocalName,
  v2ClientName,
  v2GlobalName,
}: GetClientNewExpressionOptions): NewExpression => {
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
    // Hack for AWS.DynamoDB.DocumentClient
    if (v2ClientName === DYNAMODB_DOCUMENT_CLIENT) {
      const [DynamoDB, DocumentClient] = v2ClientName.split(".");
      return {
        type: "NewExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: { type: "Identifier", name: v2GlobalName },
            property: { type: "Identifier", name: DynamoDB },
          },
          property: { type: "Identifier", name: DocumentClient },
        },
      } as NewExpression;
    }

    return {
      type: "NewExpression",
      callee: {
        object: { type: "Identifier", name: v2GlobalName },
        property: { type: "Identifier", ...(v2ClientName && { name: v2ClientName }) },
      },
    } as NewExpression;
  }

  // Hack for DynamoDBLocalName.DocumentClient
  if (v2ClientLocalName && v2ClientLocalName.endsWith(`.${DOCUMENT_CLIENT}`)) {
    const [DynamoDBLocalName, DocumentClient] = v2ClientLocalName.split(".");
    return {
      type: "NewExpression",
      callee: {
        object: { type: "Identifier", name: DynamoDBLocalName },
        property: { type: "Identifier", name: DocumentClient },
      },
    } as NewExpression;
  }

  return {
    type: "NewExpression",
    callee: { type: "Identifier", name: v2ClientLocalName },
  } as NewExpression;
};
