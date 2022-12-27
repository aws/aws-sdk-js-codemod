import {
  ASTPath,
  Collection,
  Identifier,
  JSCodeshift,
  TSQualifiedName,
  TSTypeReference,
} from "jscodeshift";

import { getV2ClientTypeNames, getV3ClientTypeName } from "../get";
import { isV2ClientInputOutputType } from "../isV2ClientInputOutputType";

export interface ReplaceTypeReferenceOptions {
  v2ClientName: string;
  v3ClientName: string;
  v2DefaultModuleName: string;
}

const getRightIdentifierName = (node: TSTypeReference) =>
  ((node.typeName as TSQualifiedName).right as Identifier).name;

const getIdentifierName = (node: TSTypeReference) => (node.typeName as Identifier).name;

// Replace v2 client type reference with v3 client type reference.
export const replaceTSTypeReference = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName, v3ClientName }: ReplaceTypeReferenceOptions
): void => {
  // Replace type reference to client created with default module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        left: { type: "Identifier", name: v2DefaultModuleName },
        right: { type: "Identifier", name: v2ClientName },
      },
    })
    .replaceWith((v2ClientType) =>
      j.tsTypeReference(j.identifier(v3ClientName), v2ClientType.node.typeParameters)
    );

  // Replace type reference to client input/output created with default module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        type: "TSQualifiedName",
        left: {
          left: { type: "Identifier", name: v2DefaultModuleName },
          right: { type: "Identifier", name: v2ClientName },
        },
        right: { type: "Identifier" },
      },
    })
    .filter((v2ClientType) => isV2ClientInputOutputType(getRightIdentifierName(v2ClientType.node)))
    .replaceWith((v2ClientType) => getV3ClientTypeName(getRightIdentifierName(v2ClientType.node)));

  // Replace type reference to client created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        left: { type: "Identifier", name: v2ClientName },
      },
    })
    .filter((v2ClientType) => isV2ClientInputOutputType(getRightIdentifierName(v2ClientType.node)))
    .replaceWith((v2ClientType) => getV3ClientTypeName(getRightIdentifierName(v2ClientType.node)));

  // Replace type reference to client input/output import with named imports.
  const v2ClientTypeNames = getV2ClientTypeNames(j, source, { v2ClientName, v2DefaultModuleName });
  for (const v2ClientTypeName of v2ClientTypeNames) {
    if (isV2ClientInputOutputType(v2ClientTypeName)) {
      source
        .find(j.TSTypeReference, {
          typeName: { type: "Identifier", name: v2ClientTypeName },
        })
        .filter((v2ClientType) => isV2ClientInputOutputType(getIdentifierName(v2ClientType.node)))
        .replaceWith((v2ClientType) => getV3ClientTypeName(getIdentifierName(v2ClientType.node)));
    }
  }
};
