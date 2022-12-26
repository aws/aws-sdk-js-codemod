import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

export interface GetV2ClientTypesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

const getRightIdentifierName = (node: TSTypeReference) =>
  ((node.typeName as TSQualifiedName).right as Identifier).name;

export const getV2ClientTypes = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2DefaultModuleName }: GetV2ClientTypesOptions
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

  return [
    ...source
      .find(j.TSTypeReference, v2DefaultTypeName)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
    ...source
      .find(j.TSTypeReference, v2ClientTypeName)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
  ];
};
