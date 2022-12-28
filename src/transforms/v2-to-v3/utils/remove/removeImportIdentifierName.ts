import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportIdentifierNameOptions {
  importedName?: string;
  localName: string;
  literalValue: string;
}

export const removeImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: RemoveImportIdentifierNameOptions
) => {
  const { localName, literalValue } = options;
  const importedName = options.importedName ?? localName;

  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: localName } }],
      source: { value: literalValue },
    })
    .forEach((declarationPath) => {
      // Remove default import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (specifier.local?.name === localName) {
          if (specifier.type === "ImportSpecifier") {
            return specifier.imported?.name === importedName;
          }
          return false;
        }
      });
      // Remove ImportDeclaration if there are no other imports.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
