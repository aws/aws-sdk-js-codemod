import { Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

import { getImportSpecifiers } from "../modules";
import { getClientDeepImportPath } from "../utils";

export interface GetClientTypeNamesOptions {
  v2ClientName: string;
  v2GlobalName?: string;
  v2ClientLocalName: string;
}

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

const getRightIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  tsQualifiedName: DeepPartial<TSQualifiedName>
) =>
  source
    .find(j.TSQualifiedName, tsQualifiedName)
    .filter((tsQualifiedName) => tsQualifiedName.parentPath?.value.type !== "TSQualifiedName")
    .nodes()
    .map((node) => node.right)
    .filter((node) => node.type === "Identifier")
    .map((node) => (node as Identifier).name);

export const getClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2ClientName, v2GlobalName }: GetClientTypeNamesOptions
): string[] => {
  const clientTypeNames = [];

  if (v2GlobalName) {
    // Support for DynamoDB.DocumentClient
    const [clientName, subClientName] = v2ClientName.split(".");

    clientTypeNames.push(
      ...getRightIdentifierName(j, source, {
        left: {
          ...(subClientName
            ? {
                left: {
                  left: { type: "Identifier", name: v2GlobalName },
                  right: { type: "Identifier", name: clientName },
                },
                right: { type: "Identifier", name: subClientName },
              }
            : {
                left: { type: "Identifier", name: v2GlobalName },
                right: { type: "Identifier", name: clientName },
              }),
        },
      })
    );
  }

  // Support for DynamoDB.DocumentClient
  const [clientName, subClientName] = v2ClientLocalName!.split(".");

  clientTypeNames.push(
    ...getRightIdentifierName(j, source, {
      ...(subClientName
        ? {
            left: {
              left: { type: "Identifier", name: clientName },
              right: { type: "Identifier", name: subClientName },
            },
          }
        : { left: { type: "Identifier", name: clientName } }),
    })
  );

  clientTypeNames.push(
    ...getImportSpecifiers(j, source, getClientDeepImportPath(v2ClientName))
      .filter(
        (importSpecifier) =>
          importSpecifier.type === "ImportSpecifier" &&
          importSpecifier.local &&
          importSpecifier.local.type === "Identifier"
      )
      .map((importSpecifier) => (importSpecifier.local as Identifier).name)
  );

  return [...new Set(clientTypeNames)];
};
