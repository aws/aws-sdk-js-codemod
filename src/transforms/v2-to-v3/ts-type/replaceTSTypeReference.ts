import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientTypeNames } from "./getClientTypeNames";
import { getV3ClientTypeReference } from "./getV3ClientTypeReference";

export interface ReplaceTSTypeReferenceOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
}

const isRightSectionIdentifier = (node: TSTypeReference) =>
  (node.typeName as TSQualifiedName).right.type === "Identifier";

const getRightIdentifierName = (node: TSTypeReference) =>
  ((node.typeName as TSQualifiedName).right as Identifier).name;

const getIdentifierName = (node: TSTypeReference) => (node.typeName as Identifier).name;

const getTypeNameRefFromClientName = (
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
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceTSTypeReferenceOptions
): void => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName } = options;
  if (v2GlobalName) {
    // Replace type reference to client created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: getTypeNameRefFromClientName(v2GlobalName, v2ClientName),
      })
      .replaceWith((v2ClientType) =>
        j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
      );

    // Replace reference to client types created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: {
          left: getTypeNameRefFromClientName(v2GlobalName, v2ClientName),
        },
      })
      .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
        return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
      });
  }

  // Replace reference to client types created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        left: { type: "Identifier", name: v2ClientLocalName },
      },
    })
    .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
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
      .find(j.TSTypeReference, { typeName: { type: "Identifier", name: clientTypeName } })
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getIdentifierName(v2ClientType.node);
        return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
      });
  }

  if (v2ClientName === DYNAMODB) {
    replaceTSTypeReference(j, source, {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
    });
  }
};
