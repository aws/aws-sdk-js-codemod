import { Collection, JSCodeshift } from "jscodeshift";

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
  // Replace type reference created with default module.
  source
    .find(j.TSTypeReference, {
      typeName: { left: { name: v2DefaultModuleName } },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      node.typeName = j.identifier(v3ClientName);
      return node;
    });

  // Replace type reference created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: { type: "Identifier", name: v2ClientName },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      node.typeName = j.identifier(v3ClientName);
      return node;
    });
};
