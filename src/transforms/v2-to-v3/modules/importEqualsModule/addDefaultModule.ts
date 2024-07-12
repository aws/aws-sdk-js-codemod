import type { Collection, JSCodeshift } from "jscodeshift";

import { getImportEqualsDeclarations, getImportSpecifiers } from "../importEqualsModule";
import { getDefaultName } from "./getDefaultName";

export const addDefaultModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  packageName: string
) => {
  const defaultLocalName = getDefaultName(packageName);
  const existingImportEquals = getImportSpecifiers(j, source, packageName);

  if (existingImportEquals.length > 0) {
    if (
      existingImportEquals.some((importSpecifier) => importSpecifier.localName === defaultLocalName)
    ) {
      return;
    }
  }

  // Build a new import equals declaration.
  const v3importEqualsDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(defaultLocalName),
    j.tsExternalModuleReference(j.stringLiteral(packageName))
  );

  const v2ImportEquals = getImportEqualsDeclarations(j, source);

  if (v2ImportEquals.size()) {
    // Insert it after the first import equals declaration.
    v2ImportEquals.at(0).insertAfter(v3importEqualsDeclaration);
    return;
  }

  // Insert it at the top of the document.
  source.get().node.program.body.unshift(v3importEqualsDeclaration);
};
