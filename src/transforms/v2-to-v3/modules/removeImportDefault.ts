import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportDefaultOptions {
  localName: string;
  sourceValue: string;
}

export const removeImportDefault = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveImportDefaultOptions
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: localName } }],
      source: { value: sourceValue },
    })
    .forEach((declarationPath) => {
      // Remove default/namespace import from ImportDeclaration if there is a match
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (!["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier.type)) {
          return true;
        }
        return specifier.local?.name !== localName;
      });

      // Remove ImportDeclaration if there are no import specifiers.
      if (declarationPath.value.specifiers?.length === 0) {
        const { comments } = declarationPath.value;
        if (comments?.length) {
          const siblings = declarationPath.parent?.value.body;
          if (siblings?.length) {
            const nextSibling = siblings[siblings.indexOf(declarationPath.value) + 1];
            nextSibling.comments = [...comments, ...(nextSibling.comments || [])];
          }
        }
        j(declarationPath).remove();
      }
    });
};
