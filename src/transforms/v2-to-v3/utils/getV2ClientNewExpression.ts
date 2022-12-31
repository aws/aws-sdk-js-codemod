import { NewExpression } from "jscodeshift";

export interface ClientNewExpressionOptions {
  v2GlobalName?: string;
  v2ClientName?: string;
  isDocumentClient?: boolean;
}

export const getV2ClientNewExpression = ({
  v2GlobalName,
  v2ClientName,
}: ClientNewExpressionOptions): NewExpression => {
  if (!v2GlobalName && !v2ClientName) {
    throw new Error(
      `At least one of the following options must be provided: v2GlobalName, v2ClientName`
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
    callee: { type: "Identifier", name: v2ClientName },
  } as NewExpression;
};
