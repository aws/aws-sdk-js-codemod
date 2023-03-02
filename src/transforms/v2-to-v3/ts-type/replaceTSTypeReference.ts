import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { getClientTSTypeRef } from "../utils";
import { getV2ClientTypeNames } from "./getV2ClientTypeNames";
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

// Replace v2 client type reference with v3 client type reference.
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName }: ReplaceTSTypeReferenceOptions
): void => {
  // Replace type reference to client created with global name.
  if (v2GlobalName) {
    source
      .find(j.TSTypeReference, getClientTSTypeRef({ v2ClientName, v2GlobalName }))
      .replaceWith((v2ClientType) =>
        j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
      );

    // Replace reference to client types created with global name.
    source
      .find(
        j.TSTypeReference,
        getClientTSTypeRef({ v2ClientName, v2GlobalName, withoutRightSection: true })
      )
      .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
        return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
      });
  }

  // Replace reference to client types created with client module.
  source
    .find(j.TSTypeReference, getClientTSTypeRef({ v2ClientLocalName, withoutRightSection: true }))
    .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
    .replaceWith((v2ClientType) => {
      const v2ClientTypeName = getRightIdentifierName(v2ClientType.node);
      return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
    });

  // Replace type reference to client type with modules.
  const v2ClientTypeNames = getV2ClientTypeNames(j, source, {
    v2ClientLocalName,
    v2ClientName,
    v2GlobalName,
  });

  for (const v2ClientTypeName of v2ClientTypeNames) {
    source
      .find(j.TSTypeReference, { typeName: { type: "Identifier", name: v2ClientTypeName } })
      .replaceWith((v2ClientType) => {
        const v2ClientTypeName = getIdentifierName(v2ClientType.node);
        return getV3ClientTypeReference(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });
      });
  }
};
