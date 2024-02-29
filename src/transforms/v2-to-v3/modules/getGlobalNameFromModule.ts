import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getImportEqualsDeclarationType } from "./getImportEqualsDeclarationType";
import { getImportSpecifiers } from "./importModule";
import { getRequireDeclarators } from "./requireModule";
import { ImportSpecifierDefault } from ".";

export const getGlobalNameFromModule = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  const requireIdentifiers = getRequireDeclarators(j, source, PACKAGE_NAME)
    .filter((declarator) => declarator.value.id.type === "Identifier")
    .nodes();

  if (requireIdentifiers.length > 0) {
    return (requireIdentifiers[0]?.id as Identifier).name;
  }

  const importDefaultSpecifiers = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => typeof importSpecifier === "string"
  ) as ImportSpecifierDefault[];

  if (importDefaultSpecifiers.length > 0) {
    return importDefaultSpecifiers[0];
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
