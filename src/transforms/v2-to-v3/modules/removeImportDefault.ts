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
      // Remove import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (!["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier.type)) {
          return true;
        }
        if (specifier.local?.name === localName) {
          return false;
        }
      });
      // Remove ImportDeclaration if there are no other imports.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
