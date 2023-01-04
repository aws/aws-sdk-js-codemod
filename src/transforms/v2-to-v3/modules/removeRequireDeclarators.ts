import { Collection, JSCodeshift, VariableDeclarator } from "jscodeshift";

export const removeRequireDeclarators = (
  j: JSCodeshift,
  requireDeclarators: Collection<VariableDeclarator>
) => {
  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);

    // Remove Identifier or ObjectPattern from VariableDeclarator.
    j(varDeclarator).remove();

    // Remove VariableDeclaration if there are no declarations.
    const varDeclaration = varDeclarationCollection.nodes()[0];
    if (varDeclaration.declarations?.length === 0) {
      varDeclarationCollection.remove();
    }
  });
};
