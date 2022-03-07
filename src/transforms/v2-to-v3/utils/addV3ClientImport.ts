import { Collection, JSCodeshift } from "jscodeshift";

export interface AddV3ClientImportOptions {
  v3ClientName: string;
  v3ClientPackageName: string;
}

export const addV3ClientImport = (
  j: JSCodeshift,
  source: Collection<any>,
  { v3ClientName, v3ClientPackageName }: AddV3ClientImportOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  // Import decleration already exists.
  if (existingImports.size()) {
    existingImports.forEach((nodePath) => {
      // Append to existing import if specifier not present.
      if (!nodePath.value.specifiers.find((specifier) => specifier.local.name === v3ClientName)) {
        nodePath.value.specifiers.push(j.importSpecifier(j.identifier(v3ClientName)));
      }
    });
    return;
  }

  source
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === "aws-sdk")
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier(v3ClientName))],
        j.stringLiteral(v3ClientPackageName)
      )
    );
};
