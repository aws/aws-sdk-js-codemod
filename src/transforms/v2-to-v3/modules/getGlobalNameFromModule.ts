import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getImportSpecifiers } from "./getImportSpecifiers";
import { hasRequire } from "./hasRequire";

export const getGlobalNameFromModule = (
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

  const importDefaultSpecifiers = getImportSpecifiers(j, source, PACKAGE_NAME).filter((specifier) =>
    ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(specifier?.type as string)
  );

  if (importDefaultSpecifiers.length > 0) {
    return (importDefaultSpecifiers[0]?.local as Identifier).name;
  }

  const importEqualsDeclarations = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclaration(PACKAGE_NAME)
  );

  if (importEqualsDeclarations.length > 0) {
    return importEqualsDeclarations.nodes()[0]?.id?.name;
  }

  return undefined;
};
