import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getV2ClientTSTypeRef } from "./getV2ClientTSTypeRef";
import { getV2ClientTypeNames } from "./getV2ClientTypeNames";
import { getV3ClientTypeName } from "./getV3ClientTypeName";

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

const getV3ClientTypeReference = (
  j: JSCodeshift,
  v2ClientLocalName: string,
  v3ClientTypeName: string
) =>
  j.tsTypeReference(
    j.identifier([getV3ClientDefaultLocalName(v2ClientLocalName), v3ClientTypeName].join("."))
  );

// Replace v2 client type reference with v3 client type reference.
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName }: ReplaceTSTypeReferenceOptions
): void => {
  // Replace type reference to client created with global name.
  source
    .find(j.TSTypeReference, getV2ClientTSTypeRef({ v2ClientName, v2GlobalName }))
    .replaceWith((v2ClientType) =>
      j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
    );

  // Replace reference to client types created with global name.
  source
    .find(
      j.TSTypeReference,
      getV2ClientTSTypeRef({ v2ClientName, v2GlobalName, withoutRightSection: true })
    )
    .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
    .replaceWith((v2ClientType) =>
      getV3ClientTypeReference(
        j,
        v2ClientLocalName,
        getV3ClientTypeName(getRightIdentifierName(v2ClientType.node))
      )
    );

  // Replace reference to client types created with client module.
  source
    .find(j.TSTypeReference, getV2ClientTSTypeRef({ v2ClientName, withoutRightSection: true }))
    .filter((v2ClientType) => isRightSectionIdentifier(v2ClientType.node))
    .replaceWith((v2ClientType) =>
      getV3ClientTypeReference(
        j,
        v2ClientLocalName,
        getV3ClientTypeName(getRightIdentifierName(v2ClientType.node))
      )
    );

  // Replace type reference to client type with modules.
  const v2ClientTypeNames = getV2ClientTypeNames(j, source, { v2ClientName, v2GlobalName });
  for (const v2ClientTypeName of v2ClientTypeNames) {
    source
      .find(j.TSTypeReference, { typeName: { type: "Identifier", name: v2ClientTypeName } })
      .replaceWith((v2ClientType) =>
        getV3ClientTypeReference(
          j,
          v2ClientLocalName,
          getV3ClientTypeName(getIdentifierName(v2ClientType.node))
        )
      );
  }
};
