import { Collection, JSCodeshift } from "jscodeshift";

export const removeUnusedDefaultImport = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultImportName: string
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ type: "ImportDefaultSpecifier", local: { name: defaultImportName } }],
    })
    .forEach((declerationPath) => {
      // Remove default import from ImportDecleration.
      declerationPath.value.specifiers = declerationPath.value.specifiers.filter(
        (specifier) =>
          specifier.type !== "ImportDefaultSpecifier" && specifier.local.name !== defaultImportName
      );
      // Remove ImportDeclaration if there are no other imports.
      if (declerationPath.value.specifiers.length === 0) {
        j(declerationPath).remove();
      }
    });
};
