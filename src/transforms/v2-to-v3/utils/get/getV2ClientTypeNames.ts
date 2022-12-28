import {
  Collection,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
  TSQualifiedName,
  TSTypeReference,
} from "jscodeshift";

import { getV2ClientTSTypeRef } from "./getV2ClientTSTypeRef";
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
  const v2GlobalTSTypeRef = getV2ClientTSTypeRef({
    v2ClientName,
    v2DefaultModuleName,
    withoutRightSection: true,
  });
  const v2ClientTSTypeRef = getV2ClientTSTypeRef({ v2ClientName, withoutRightSection: true });

  const v2ServiceModuleImportDeclaration = {
    type: "ImportDeclaration",
    source: { value: getV2ServiceModulePath(v2ClientName) },
  } as ImportDeclaration;

  return [
    ...source
      .find(j.TSTypeReference, v2GlobalTSTypeRef)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
    ...source
      .find(j.TSTypeReference, v2ClientTSTypeRef)
      .nodes()
      .map((node) => getRightIdentifierName(node)),
    ...source
      .find(j.ImportDeclaration, v2ServiceModuleImportDeclaration)
      .nodes()
      .map((node) => node.specifiers)
      .flat()
      .filter((node) => (node as ImportSpecifier).type === "ImportSpecifier")
      .map((node) => ((node as ImportSpecifier).local as Identifier).name),
  ];
};
