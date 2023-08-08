import { ASTPath, Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientTypeNames } from "./getClientTypeNames";
import { getV3ClientTypeReference } from "./getV3ClientTypeReference";

export interface ReplaceTSQualifiedNameOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
}

const nativeTsTypes = ["TSAnyKeyword", "TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"];

const isRightSectionIdentifier = (node: TSQualifiedName) => node.right.type === "Identifier";

const getRightIdentifierName = (node: TSQualifiedName) => (node.right as Identifier).name;

const isParentTSQualifiedName = (node: ASTPath<TSQualifiedName>) =>
  node.parentPath?.value.type === "TSQualifiedName";

const getTSQualifiedNameFromClientName = (
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

// Replace v2 client type reference with v3 client type reference.
export const replaceTSQualifiedName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceTSQualifiedNameOptions
): void => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName } = options;

  if (v2GlobalName) {
    // Replace type reference to client created with global name.
    source
      .find(j.TSQualifiedName, getTSQualifiedNameFromClientName(v2GlobalName, v2ClientName))
      .filter((v2ClientType) => !isParentTSQualifiedName(v2ClientType))
      .replaceWith(() => j.tsTypeReference(j.identifier(v3ClientName)));

    // Replace reference to client types created with global name.
    source
      .find(j.TSQualifiedName, {
        left: getTSQualifiedNameFromClientName(v2GlobalName, v2ClientName),
      })
      .filter(
        (v2ClientType) =>
          isRightSectionIdentifier(v2ClientType.node) && !isParentTSQualifiedName(v2ClientType)
      )
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
        const v3ClientTypeRef = getV3ClientTypeReference(j, {
          v2ClientName,
          v2ClientTypeName,
          v2ClientLocalName,
        });
        // if (
        //   v2ClientType.parentPath?.value.type === "TSTypeQuery" &&
        //   nativeTsTypes.includes(v3ClientTypeRef.type)
        // ) {
        //   v2ClientType.parentPath.value = v2ClientType.parentPath.parentPath.value;
        // }
        return v3ClientTypeRef;
      });
  }

  const [clientNamePrefix, clientNameSuffix] = v2ClientLocalName.split(".");
  // Replace reference to client types created with client module.
  source
    .find(j.TSQualifiedName, {
      ...(clientNameSuffix
        ? {
            left: {
              left: { type: "Identifier", name: clientNamePrefix },
              right: { type: "Identifier", name: clientNameSuffix },
            },
          }
        : { left: { type: "Identifier", name: clientNamePrefix } }),
    })
    .filter(
      (v2ClientType) =>
        isRightSectionIdentifier(v2ClientType.node) && !isParentTSQualifiedName(v2ClientType)
    )
    .replaceWith((v2ClientType) => {
      const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
      return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
    });

  // Replace type reference to client type with modules.
  const clientTypeNames = getClientTypeNames(j, source, {
    v2ClientLocalName,
    v2ClientName,
    v2GlobalName,
  });

  for (const clientTypeName of clientTypeNames) {
    source
      .find(j.Identifier, { name: clientTypeName })
      .filter(
        (v2ClientType) =>
          !["TSQualifiedName", "ImportSpecifier"].includes(v2ClientType.parentPath?.value.type)
      )
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = v2ClientType.node.name;
        return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
      });
  }

  if (v2ClientName === DYNAMODB) {
    replaceTSQualifiedName(j, source, {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
    });
  }
};
