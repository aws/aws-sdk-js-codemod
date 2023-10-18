import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../../config";
import { getImportEqualsDeclarationType } from "../getImportEqualsDeclarationType";
import { getDefaultName } from "./getDefaultName";

export const addDefaultModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  packageName: string
) => {
  const defaultLocalName = getDefaultName(packageName);
  const existingImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclarationType(packageName)
  );

  if (existingImportEquals.size()) {
    if (
      existingImportEquals
        .nodes()
        .some((importEqualsDeclaration) => importEqualsDeclaration.id.name === defaultLocalName)
    ) {
      return;
    }
  }

  // Build a new import equals declaration.
  const v3importEqualsDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(defaultLocalName),
    j.tsExternalModuleReference(j.stringLiteral(packageName))
  );

  const v2ImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclarationType(PACKAGE_NAME)
  );

  if (v2ImportEquals.size()) {
    // Insert it after the first import equals declaration.
    v2ImportEquals.at(0).insertAfter(v3importEqualsDeclaration);
    return;
  }

  // Insert it at the top of the document.
  source.get().node.program.body.unshift(v3importEqualsDeclaration);
};
