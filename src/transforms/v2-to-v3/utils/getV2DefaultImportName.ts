import { Collection, JSCodeshift } from "jscodeshift";

export const getV2DefaultImportName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined =>
  source
    .find(j.ImportDeclaration, {
      source: { value: "aws-sdk" },
    })
    .nodes()[0]?.specifiers[0]?.local.name;
