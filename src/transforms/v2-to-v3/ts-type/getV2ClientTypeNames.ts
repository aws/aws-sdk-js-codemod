import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { getImportSpecifiers } from "../modules";
import { getV2ClientTSTypeRef, getV2ServiceModulePath } from "../utils";

export interface GetV2ClientTypeNamesOptions {
  v2ClientName: string;
  v2GlobalName?: string;
  v2ClientLocalName: string;
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
  { v2ClientLocalName, v2ClientName, v2GlobalName }: GetV2ClientTypeNamesOptions
): string[] => {
  const v2ClientTypeNames = [];

  if (v2GlobalName) {
    const v2GlobalTSTypeRef = getV2ClientTSTypeRef({
      v2ClientName,
      v2GlobalName,
      withoutRightSection: true,
    });
    v2ClientTypeNames.push(...getRightIdentifierName(j, source, v2GlobalTSTypeRef));
  }

  const v2ClientTSTypeRef = getV2ClientTSTypeRef({ v2ClientLocalName, withoutRightSection: true });
  v2ClientTypeNames.push(...getRightIdentifierName(j, source, v2ClientTSTypeRef));

  v2ClientTypeNames.push(
    ...getImportSpecifiers(j, source, getV2ServiceModulePath(v2ClientName))
      .filter(
        (importSpecifier) =>
          importSpecifier.type === "ImportSpecifier" &&
          importSpecifier.local &&
          importSpecifier.local.type === "Identifier"
      )
      .map((importSpecifier) => (importSpecifier.local as Identifier).name)
  );

  return [...new Set(v2ClientTypeNames)];
};
