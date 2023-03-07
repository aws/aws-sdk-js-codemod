import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { getImportSpecifiers } from "../modules";
import { getClientDeepImportPath } from "../utils";

export interface GetClientTypeNamesOptions {
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

export const getClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2ClientName, v2GlobalName }: GetClientTypeNamesOptions
): string[] => {
  const clientTypeNames = [];

  if (v2GlobalName) {
    clientTypeNames.push(
      ...getRightIdentifierName(j, source, {
        type: "TSTypeReference",
        typeName: {
          type: "TSQualifiedName",
          left: { type: "Identifier", name: v2GlobalName },
          right: { type: "Identifier", name: v2ClientName },
        },
      })
    );
  }

  clientTypeNames.push(
    ...getRightIdentifierName(j, source, {
      type: "TSTypeReference",
      typeName: { type: "Identifier", name: v2ClientLocalName },
    })
  );

  clientTypeNames.push(
    ...getImportSpecifiers(j, source, getClientDeepImportPath(v2ClientName))
      .filter(
        (importSpecifier) =>
          importSpecifier.type === "ImportSpecifier" &&
          importSpecifier.local &&
          importSpecifier.local.type === "Identifier"
      )
      .map((importSpecifier) => (importSpecifier.local as Identifier).name)
  );

  return [...new Set(clientTypeNames)];
};
