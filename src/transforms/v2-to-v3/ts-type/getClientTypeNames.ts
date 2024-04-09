import { Collection, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { ImportSpecifierType } from "../modules";
import { getImportSpecifiers } from "../modules/importModule";
import { getClientDeepImportPath } from "../utils";
import { DeepPartial, getTSQualifiedNameFromClientName } from "./getTSQualifiedNameFromClientName";

export interface GetClientTypeNamesOptions {
  v2ClientName: string;
  v2GlobalName?: string;
  v2ClientLocalName: string;
}

const getRightIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  tsTypeRef: DeepPartial<TSTypeReference>
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
        typeName: {
          left: getTSQualifiedNameFromClientName(v2ClientName, v2GlobalName),
        },
      })
    );
  }

  clientTypeNames.push(
    ...getRightIdentifierName(j, source, {
      typeName: getTSQualifiedNameFromClientName(v2ClientLocalName),
    })
  );

  clientTypeNames.push(
    ...getImportSpecifiers(j, source, getClientDeepImportPath(v2ClientName))
      .filter((importSpecifier) => importSpecifier.importedName)
      .map((importSpecifier) => (importSpecifier as ImportSpecifierType).localName!)
  );

  return [...new Set(clientTypeNames)];
};
