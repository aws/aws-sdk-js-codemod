import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export interface ReplaceClientCreationOptions {
  importObj: Identifier;
  v2ClientName: string;
  v3ClientName: string;
}

// Replace v2 client creation with v3 client creation.
export const replaceClientCreation = (
  j: JSCodeshift,
  source: Collection<any>,
  { importObj, v2ClientName, v3ClientName }: ReplaceClientCreationOptions
): void => {
  source
    .find(j.NewExpression, {
      callee: {
        object: { type: "Identifier", name: importObj.name },
        property: { type: "Identifier", name: v2ClientName },
      },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      node.callee = j.identifier(v3ClientName);
      return node;
    });
};
