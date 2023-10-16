import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getImportEqualsDeclarationType } from "./getImportEqualsDeclarationType";
import { getImportSpecifiers } from "./getImportSpecifiers";
import { ImportType } from "./types";

export const getGlobalNameFromModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
): string | undefined => {
  if (importType === ImportType.REQUIRE) {
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
    getImportEqualsDeclarationType(PACKAGE_NAME)
  );

  if (importEqualsDeclarations.length > 0) {
    return importEqualsDeclarations.nodes()[0]?.id?.name;
  }

  return undefined;
};
