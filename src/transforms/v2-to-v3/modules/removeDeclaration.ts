import type {
  ASTPath,
  Collection,
  ImportDeclaration,
  JSCodeshift,
  VariableDeclaration,
} from "jscodeshift";

/**
 * Removes import/variable declaration, but preserves comments if they're top level comments.
 */
export const removeDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  declarationPath: ASTPath<ImportDeclaration | VariableDeclaration>
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
