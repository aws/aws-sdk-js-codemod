import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientType } from "../get";

export interface ReplaceTypeReferenceOptions {
  v2ClientName: string;
  v3ClientName: string;
  v2DefaultModuleName: string;
}

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
    .replaceWith((tsTypeRef) => {
      const { node } = tsTypeRef;
      node.typeName = j.identifier(v3ClientName);
      return node;
    });

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
    .replaceWith((v2ClientType) => getV3ClientType(j, v2ClientType));

  // Replace type reference to client created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        left: { type: "Identifier", name: v2ClientName },
      },
    })
    .replaceWith((v2ClientType) => getV3ClientType(j, v2ClientType));
};
