import {
  Collection,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
  TSQualifiedName,
  TSTypeReference,
} from "jscodeshift";

import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export interface GetV2ClientTypeNamesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

const getRightIdentifierName = (node: TSTypeReference) =>
  ((node.typeName as TSQualifiedName).right as Identifier).name;

export const getV2ClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2DefaultModuleName }: GetV2ClientTypeNamesOptions
): string[] => {
  const v2DefaultTypeName = {
    typeName: {
      left: {
        left: { type: "Identifier", name: v2DefaultModuleName },
        right: { type: "Identifier", name: v2ClientName },
      },
    },
  } as TSTypeReference;

  const v2ClientTypeName = {
    typeName: {
      left: { type: "Identifier", name: v2ClientName },
    },
  } as TSTypeReference;

  const v2ClientTypeFromNamedImport = {
    type: "ImportDeclaration",
    source: { value: getV2ServiceModulePath(v2ClientName) },
  } as ImportDeclaration;

  return [
    ...source
      .find(j.TSTypeReference, v2DefaultTypeName)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
    ...source
      .find(j.TSTypeReference, v2ClientTypeName)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
    ...source
      .find(j.ImportDeclaration, v2ClientTypeFromNamedImport)
      .nodes()
      .map((node) => node.specifiers)
      .flat()
      .filter((node) => (node as ImportSpecifier).type === "ImportSpecifier")
      .map((node) => ((node as ImportSpecifier).local as Identifier).name),
  ];
};
