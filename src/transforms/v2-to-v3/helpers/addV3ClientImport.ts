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
