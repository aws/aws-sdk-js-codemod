import type { Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

import {
  DOCUMENT_CLIENT,
  DYNAMODB,
  DYNAMODB_DOCUMENT,
  DYNAMODB_DOCUMENT_CLIENT,
} from "../config/index.ts";
import { getClientTypeNames } from "./getClientTypeNames.ts";
import { getTSQualifiedNameFromClientName } from "./getTSQualifiedNameFromClientName.ts";
import { getV3ClientType } from "./getV3ClientType.ts";

export interface ReplaceTSTypeReferenceOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
}

// Replace v2 client type reference with v3 client type reference.
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceTSTypeReferenceOptions
): void => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName } = options;
  const clientTypeOptions = { v2ClientName, v2ClientLocalName };

  // DynamoDb DocumentClient types need to be updated first.
  if (v2ClientName === DYNAMODB) {
    const ddbClientLocalName = `${v2ClientLocalName}.${DOCUMENT_CLIENT}`;

    replaceTSTypeReference(j, source, {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      v2ClientLocalName: ddbClientLocalName,
      v3ClientName: DYNAMODB_DOCUMENT,
    });

    source
      .find(j.TSTypeReference, { typeName: getTSQualifiedNameFromClientName(ddbClientLocalName) })
      .replaceWith(() => j.tsTypeReference(j.identifier(DYNAMODB_DOCUMENT)));
  }

  if (v2GlobalName) {
    // Replace type reference to client created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: getTSQualifiedNameFromClientName(v2ClientName, v2GlobalName),
      })
      .replaceWith((v2ClientType) =>
        j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
      );

    // Replace reference to client types created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: {
          left: getTSQualifiedNameFromClientName(v2ClientName, v2GlobalName),
        },
      })
      .replaceWith((v2ClientType) => {
        const tSQualifiedName = v2ClientType.node.typeName as TSQualifiedName;
        if (tSQualifiedName.right.type !== "Identifier") {
          return v2ClientType;
        }
        const v2ClientTypeName = tSQualifiedName.right.name;
        return getV3ClientType(j, { ...clientTypeOptions, v2ClientTypeName });
      });
  }

  source
    .find(j.TSTypeReference, { typeName: getTSQualifiedNameFromClientName(v2ClientName) })
    .replaceWith(() => j.tsTypeReference(j.identifier(v3ClientName)));

  source
    .find(j.TSTypeReference, {
      typeName: { left: getTSQualifiedNameFromClientName(v2ClientLocalName) },
    })
    .replaceWith((v2ClientType) => {
      const tSQualifiedName = v2ClientType.node.typeName as TSQualifiedName;
      if (tSQualifiedName.right.type !== "Identifier") {
        return v2ClientType;
      }
      const v2ClientTypeName = tSQualifiedName.right.name;
      return getV3ClientType(j, { ...clientTypeOptions, v2ClientTypeName });
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
        const v2ClientTypeName = (v2ClientType.node.typeName as Identifier).name;
        return getV3ClientType(j, { ...clientTypeOptions, v2ClientTypeName });
      });
  }
};
