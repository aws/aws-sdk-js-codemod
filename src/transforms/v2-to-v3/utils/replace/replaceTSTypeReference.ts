import { Collection, JSCodeshift, TSTypeReference } from "jscodeshift";

export interface ReplaceTypeReferenceOptions {
  v2ClientName: string;
  v3ClientName: string;
  v2DefaultModuleName: string;
}

const getTsTypeWithClientName = (j: JSCodeshift, node: TSTypeReference, v3ClientName: string) => {
  node.typeName = j.identifier(v3ClientName);
  return node;
};

const getTsTypeWithInputOutput = (j: JSCodeshift, node: TSTypeReference, v2IoName: string) => {
  if (v2IoName.endsWith("Input")) {
    node.typeName = j.identifier(v2IoName.replace(/Input$/, "CommandInput"));
  } else if (v2IoName.endsWith("Output")) {
    node.typeName = j.identifier(v2IoName.replace(/Output$/, "CommandOutput"));
  }
  return node;
};

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
    .replaceWith((tsTypeRef) => getTsTypeWithClientName(j, tsTypeRef.node, v3ClientName));

  // Replace type reference to client input/output created with default module.
  source
    .find(j.TSTypeReference, {
      typeName: {
        left: {
          left: { type: "Identifier", name: v2DefaultModuleName },
          right: { type: "Identifier", name: v2ClientName },
        },
      },
    })
    .replaceWith((tsTypeRef) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Property 'right' does not exist.
      getTsTypeWithInputOutput(j, tsTypeRef.node, tsTypeRef.node.typeName.right.name)
    );

  // Replace type reference to client created with client module.
  source
    .find(j.TSTypeReference, {
      typeName: { type: "Identifier", name: v2ClientName },
    })
    .replaceWith((tsTypeRef) => getTsTypeWithClientName(j, tsTypeRef.node, v3ClientName));
};
