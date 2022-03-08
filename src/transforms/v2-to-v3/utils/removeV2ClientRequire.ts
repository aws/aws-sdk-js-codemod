import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";

export const removeV2ClientRequire = (
  j: JSCodeshift,
  source: Collection<any>,
  v2ClientName: string
) => {
  const requireLiteralName = `aws-sdk/clients/${v2ClientName.toLowerCase()}`;
  getRequireVariableDeclaration(j, source, requireLiteralName)
    .filter(
      (nodePath) =>
        ((nodePath.value.declarations[0] as VariableDeclarator).id as Identifier).name ===
        v2ClientName
    )
    .remove();
};
