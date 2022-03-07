import { Collection, JSCodeshift } from "jscodeshift";

export const getV2DefaultImportName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined => {
  let v2DefaultImportName = undefined;

  // Set specifier name in v2DefaultImportName if it is imported in the source.
  source
    .find(j.ImportDeclaration, {
      source: { value: "aws-sdk" },
    })
    .forEach((declerationPath) => {
      declerationPath.value.specifiers.forEach((specifier) => {
        if (
          specifier.type === "ImportDefaultSpecifier" ||
          specifier.type === "ImportNamespaceSpecifier"
        ) {
          v2DefaultImportName = specifier.local.name;
        }
      });
    });

  return v2DefaultImportName;
};
