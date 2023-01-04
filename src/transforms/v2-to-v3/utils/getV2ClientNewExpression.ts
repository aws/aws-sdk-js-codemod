import { NewExpression } from "jscodeshift";

export interface ClientNewExpressionOptions {
  v2ClientLocalName?: string;
  v2ClientName?: string;
  v2GlobalName?: string;
}

export const getV2ClientNewExpression = ({
  v2ClientLocalName,
  v2ClientName,
  v2GlobalName,
}: ClientNewExpressionOptions): NewExpression => {
  if (!v2GlobalName && !v2ClientLocalName) {
    throw new Error(
      `At least one of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName && v2ClientLocalName) {
    throw new Error(
      `Only one of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName) {
    return {
      type: "NewExpression",
      callee: {
        object: { type: "Identifier", name: v2GlobalName },
        property: { type: "Identifier", ...(v2ClientName && { name: v2ClientName }) },
      },
    } as NewExpression;
  }

  return {
    type: "NewExpression",
    callee: { type: "Identifier", name: v2ClientLocalName },
  } as NewExpression;
};
