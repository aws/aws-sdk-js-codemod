import { Collection, JSCodeshift } from "jscodeshift";

export const removeDefaultImportIfNotUsed = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultImportName: string
) => {
  const identifierUsages = source
    .find(j.Identifier, { name: defaultImportName })
    // Ignore identifier from import.
    .filter((identifierPath) => identifierPath.parentPath.value.type !== "ImportDefaultSpecifier");

  if (identifierUsages.size() === 0) {
    source
      .find(j.ImportDeclaration, {
        specifiers: [{ type: "ImportDefaultSpecifier", local: { name: defaultImportName } }],
      })
      .forEach((declerationPath) => {
        // Remove default import from ImportDecleration.
        declerationPath.value.specifiers = declerationPath.value.specifiers.filter(
          (specifier) =>
            specifier.type !== "ImportDefaultSpecifier" &&
            specifier.local.name !== defaultImportName
        );
        // Remove ImportDeclaration if there are no other imports.
        if (declerationPath.value.specifiers.length === 0) {
          j(declerationPath).remove();
        }
      });
  }
};
