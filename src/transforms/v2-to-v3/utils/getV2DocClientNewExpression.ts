import { NewExpression } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB_DOCUMENT_CLIENT } from "../config";

export interface DocClientNewExpression {
  v2ClientLocalName?: string;
  v2GlobalName?: string;
}

export const getV2DocClientNewExpression = ({
  v2ClientLocalName,
  v2GlobalName,
}: DocClientNewExpression): NewExpression => {
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
    const [DynamoDBClientName, DocumentClientName] = DYNAMODB_DOCUMENT_CLIENT.split(".");
    return {
      type: "NewExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "MemberExpression",
          object: { type: "Identifier", name: v2GlobalName },
          property: { type: "Identifier", name: DynamoDBClientName },
        },
        property: { type: "Identifier", name: DocumentClientName },
      },
    } as NewExpression;
  }

  return {
    type: "NewExpression",
    callee: {
      object: { type: "Identifier", name: v2ClientLocalName },
      property: { type: "Identifier", name: DOCUMENT_CLIENT },
    },
  } as NewExpression;
};
