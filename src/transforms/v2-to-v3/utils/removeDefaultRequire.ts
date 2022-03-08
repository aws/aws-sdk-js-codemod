import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";

export const removeDefaultRequire = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultImportName: string
) => {
  getRequireVariableDeclaration(j, source, "aws-sdk")
    .filter(
      (nodePath) =>
        ((nodePath.value.declarations[0] as VariableDeclarator).id as Identifier).name ===
        defaultImportName
    )
    .remove();
};
