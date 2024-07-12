import type { Collection, JSCodeshift } from "jscodeshift";

export const removeTypesFromTSQualifiedName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientName: string
) => {
  // Support for DynamoDB.DocumentClient
  const [, clientNameSuffix] = v2ClientName.split(".");
  const clientName = clientNameSuffix ? clientNameSuffix : v2ClientName;

  source
    .find(j.TSQualifiedName, {
      left: { type: "Identifier", name: clientName },
      right: { type: "Identifier", name: "Types" },
    })
    .replaceWith((nodePath) => nodePath.node.left);

  source
    .find(j.TSQualifiedName, {
      left: { type: "TSQualifiedName", right: { type: "Identifier", name: clientName } },
      right: { type: "Identifier", name: "Types" },
    })
    .replaceWith((nodePath) => nodePath.node.left);
};
