import { TSQualifiedName } from "jscodeshift";

export const getTSQualifiedNameFromClientName = (
  v2GlobalName: string,
  clientName: string
): TSQualifiedName => {
  // Support for DynamoDB.DocumentClient
  const [clientNamePrefix, clientNameSuffix] = clientName.split(".");

  if (clientNameSuffix) {
    return {
      left: {
        left: { type: "Identifier", name: v2GlobalName },
        right: { type: "Identifier", name: clientNamePrefix },
      },
      right: { type: "Identifier", name: clientNameSuffix },
    } as TSQualifiedName;
  }

  return {
    left: { type: "Identifier", name: v2GlobalName },
    right: { type: "Identifier", name: clientNamePrefix },
  } as TSQualifiedName;
};
