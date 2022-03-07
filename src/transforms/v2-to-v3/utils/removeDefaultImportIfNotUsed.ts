import { Collection, JSCodeshift } from "jscodeshift";

export const removeDefaultImportIfNotUsed = (
  j: JSCodeshift,
  source: Collection<any>,
  defaultImportName: string
) => {
  const identifierUsages = source
    .find(j.Identifier, { name: defaultImportName })
    // Ignore identifier from import.
    .filter((identifierPath) => !identifierPath.parentPath.value.type.startsWith("Import"));

  if (identifierUsages.size() === 0) {
    source
      .find(j.ImportDeclaration, {
        specifiers: [{ local: { name: defaultImportName } }],
        source: { value: "aws-sdk" },
      })
      .forEach((declerationPath) => {
        // Remove default import from ImportDeclaration.
        declerationPath.value.specifiers = declerationPath.value.specifiers.filter(
          (specifier) => specifier.local.name !== defaultImportName
        );
        // Remove ImportDeclaration if there are no other imports.
        if (declerationPath.value.specifiers.length === 0) {
          j(declerationPath).remove();
        }
      });
  }
};
