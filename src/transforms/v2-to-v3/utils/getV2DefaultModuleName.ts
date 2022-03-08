import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getV2DefaultModuleName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined => {
  let v2DefaultModuleName = undefined;

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
          v2DefaultModuleName = specifier.local.name;
        }
      });
    });

  // Set specifier name in v2DefaultImportName if it is required in the source.
  source
    .find(j.VariableDeclarator, {
      id: { type: "Identifier" },
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ type: "Literal", value: "aws-sdk" }],
      },
    })
    .forEach((declerationPath) => {
      v2DefaultModuleName = (declerationPath.value.id as Identifier).name;
    });

  return v2DefaultModuleName;
};
