import type { Identifier, TSQualifiedName } from "jscodeshift";

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export const getTSQualifiedNameFromClientName = (
  v2ClientName: string,
  v2GlobalName?: string
): DeepPartial<TSQualifiedName | Identifier> => {
  // Support for DynamoDB.DocumentClient
  const [clientNamePrefix, clientNameSuffix] = v2ClientName.split(".");

  if (v2GlobalName) {
    if (clientNameSuffix) {
      return {
        left: {
          left: { type: "Identifier", name: v2GlobalName },
          right: { type: "Identifier", name: clientNamePrefix },
        },
        right: { type: "Identifier", name: clientNameSuffix },
      };
    }

    return {
      left: { type: "Identifier", name: v2GlobalName },
      right: { type: "Identifier", name: clientNamePrefix },
    };
  }

  if (clientNameSuffix) {
    return {
      left: { type: "Identifier", name: clientNamePrefix },
      right: { type: "Identifier", name: clientNameSuffix },
    };
  }

  return { type: "Identifier", name: clientNamePrefix };
};
