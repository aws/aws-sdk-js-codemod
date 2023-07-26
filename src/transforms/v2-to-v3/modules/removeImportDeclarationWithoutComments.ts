import { ASTPath, ImportDeclaration, JSCodeshift } from "jscodeshift";

export const removeImportDeclarationWithoutComments = (
  j: JSCodeshift,
  declarationPath: ASTPath<ImportDeclaration>
) => {
  const { comments } = declarationPath.value;
  if (comments?.length) {
    const siblings = declarationPath.parent?.value.body;
    if (siblings?.length) {
      const nextSibling = siblings[siblings.indexOf(declarationPath.value) + 1];
      nextSibling.comments = [...comments, ...(nextSibling.comments || [])];
    }
  }
  j(declarationPath).remove();
};
