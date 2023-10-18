import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientTypeNames } from "./getClientTypeNames";
import { getTSQualifiedNameFromClientName } from "./getTSQualifiedNameFromClientName";
import { getV3ClientType } from "./getV3ClientType";

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

// Replace v2 client type reference with v3 client type reference.
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceTSTypeReferenceOptions
): void => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName } = options;
  const clientTypeOptions = { v2ClientName, v2ClientLocalName };

  if (v2GlobalName) {
    // Replace type reference to client created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: getTSQualifiedNameFromClientName(v2GlobalName, v2ClientName),
      })
      .replaceWith((v2ClientType) =>
        j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
      );

    // Replace reference to client types created with global name.
    source
      .find(j.TSTypeReference, {
        typeName: {
          left: getTSQualifiedNameFromClientName(v2GlobalName, v2ClientName),
        },
      })
      .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
        return getV3ClientType(j, { ...clientTypeOptions, v2ClientTypeName });
      });
  }

  const [clientNamePrefix, clientNameSuffix] = v2ClientLocalName.split(".");
  // Replace reference to client types created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        ...(clientNameSuffix
          ? {
              left: {
                left: { type: "Identifier", name: clientNamePrefix },
                right: { type: "Identifier", name: clientNameSuffix },
              },
            }
          : { left: { type: "Identifier", name: clientNamePrefix } }),
      },
    })
    .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
    .replaceWith((v2ClientType) => {
      const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
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

  if (v2ClientName === DYNAMODB) {
    replaceTSTypeReference(j, source, {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
    });
  }
};
