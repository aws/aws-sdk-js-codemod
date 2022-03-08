import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";

export const removeDefaultRequire = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultRequireName: string
) => {
  getRequireVariableDeclaration(j, source, "aws-sdk")
    .filter(
      (nodePath) =>
        ((nodePath.value.declarations[0] as VariableDeclarator).id as Identifier).name ===
        defaultRequireName
    )
    .remove();
};
