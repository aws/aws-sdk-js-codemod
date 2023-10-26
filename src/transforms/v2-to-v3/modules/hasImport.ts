import { Collection, JSCodeshift } from "jscodeshift";

export const hasImport = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.ImportDeclaration)
    .filter((importDeclaration) => {
      const { source: importSource } = importDeclaration.value;
      return (
        (importSource.type === "Literal" || importSource.type === "StringLiteral") &&
        typeof importSource.value === "string" &&
        importSource.value.startsWith("aws-sdk")
      );
    })
    .size() > 0;
