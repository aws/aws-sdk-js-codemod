import type { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config/index.ts";
import { getImportSpecifiers as getImportEqualsSpecifiers } from "../modules/importEqualsModule/index.ts";
import { getImportSpecifiers } from "./importModule/index.ts";
import { getRequireDeclarators } from "./requireModule/index.ts";

export const getGlobalNameFromModule = (
  j: JSCodeshift,
  source: Collection<unknown>
): string | undefined => {
  const requireIdentifiers = getRequireDeclarators(j, source, PACKAGE_NAME)
    .filter((declarator) => declarator.value.id.type === "Identifier")
    .nodes();

  if (requireIdentifiers.length > 0 && requireIdentifiers[0].id.type === "Identifier") {
    return requireIdentifiers[0].id.name;
  }

  const importDefaultSpecifiers = getImportSpecifiers(j, source, PACKAGE_NAME).filter(
    (importSpecifier) => !importSpecifier.importedName
  );

  if (importDefaultSpecifiers.length > 0) {
    return importDefaultSpecifiers[0].localName;
  }

  const importEqualsDeclarations = getImportEqualsSpecifiers(j, source, PACKAGE_NAME);

  if (importEqualsDeclarations.length > 0) {
    return importEqualsDeclarations[0].localName;
  }

  return undefined;
};
