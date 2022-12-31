import {
  Collection,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
  TSQualifiedName,
  TSTypeReference,
} from "jscodeshift";

import { getV2ServiceModulePath } from "../utils";
import { getV2ClientTSTypeRef } from "./getV2ClientTSTypeRef";

export interface GetV2ClientTypeNamesOptions {
  v2ClientName: string;
  v2GlobalName?: string;
}

const getRightIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  tsTypeRef: TSTypeReference
) =>
  source
    .find(j.TSTypeReference, tsTypeRef)
    .nodes()
    .map((node) => (node.typeName as TSQualifiedName).right)
    .filter((node) => node.type === "Identifier")
    .map((node) => (node as Identifier).name);

export const getV2ClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2GlobalName }: GetV2ClientTypeNamesOptions
): string[] => {
  const v2GlobalTSTypeRef = getV2ClientTSTypeRef({
    v2ClientName,
    v2GlobalName,
    withoutRightSection: true,
  });
  const v2ClientTSTypeRef = getV2ClientTSTypeRef({ v2ClientName, withoutRightSection: true });

  const v2ServiceModuleImportDeclaration = {
    type: "ImportDeclaration",
    source: { value: getV2ServiceModulePath(v2ClientName) },
  } as ImportDeclaration;

  return [
    ...new Set([
      ...getRightIdentifierName(j, source, v2GlobalTSTypeRef),
      ...getRightIdentifierName(j, source, v2ClientTSTypeRef),
      ...source
        .find(j.ImportDeclaration, v2ServiceModuleImportDeclaration)
        .nodes()
        .map((node) => node.specifiers)
        .flat()
        .filter((node) => (node as ImportSpecifier).type === "ImportSpecifier")
        .map((node) => ((node as ImportSpecifier).local as Identifier).name),
    ]),
  ];
};
