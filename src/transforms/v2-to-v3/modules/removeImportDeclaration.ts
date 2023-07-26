import { ASTPath, Collection, ImportDeclaration, JSCodeshift } from "jscodeshift";

/**
 * Removes import declaration, but preserves comments if they're top level comments.
 */
export const removeImportDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  declarationPath: ASTPath<ImportDeclaration>
) => {
  const firstNode = source.find(j.Program).get("body", 0).node;
  if (firstNode === declarationPath.node) {
    const { comments } = declarationPath.value;
    if (comments?.length) {
      declarationPath.insertBefore(j.emptyStatement.from({ comments }));
    }
  }
  j(declarationPath).remove();
};
