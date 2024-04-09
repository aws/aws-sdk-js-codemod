import { TSQualifiedName } from "jscodeshift";

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export const getClientTypeNameObject = (
  v2ClientName: string,
  v2GlobalName?: string
): DeepPartial<TSQualifiedName> => {
  // Support for DynamoDB.DocumentClient
  const [clientName, subClientName] = v2ClientName.split(".");

  if (v2GlobalName) {
    if (subClientName) {
      return {
        left: {
          left: { type: "Identifier", name: v2GlobalName },
          right: { type: "Identifier", name: clientName },
        },
        right: { type: "Identifier", name: subClientName },
      };
    }

    return {
      left: { type: "Identifier", name: v2GlobalName },
      right: { type: "Identifier", name: clientName },
    };
  }

  if (subClientName) {
    return {
      left: {
        left: { type: "Identifier", name: clientName },
        right: { type: "Identifier", name: subClientName },
      },
    };
  }

  return { left: { type: "Identifier", name: clientName } };
};
