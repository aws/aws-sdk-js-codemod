import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { hasRequire } from "../has";

export const getV2GlobalName = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  if (hasRequire(j, source)) {
    const requireIdentifiers = source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ value: PACKAGE_NAME }],
        },
      })
      .nodes();
    if (requireIdentifiers.length > 0) {
      return (requireIdentifiers[0]?.id as Identifier).name;
    }
  }

  const importDefaultNamespaceSpecifiers = source
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
      source: { value: PACKAGE_NAME },
    })
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter((specifier) =>
      ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
    );

  if (importDefaultNamespaceSpecifiers.length > 0) {
    return (importDefaultNamespaceSpecifiers[0]?.local as Identifier).name;
  }

  return undefined;
};
