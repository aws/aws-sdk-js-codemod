import { Collection, JSCodeshift } from "jscodeshift";

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

  // Insert import equals at the top of the document.
  source.get().node.program.body.unshift(v3importEqualsDeclaration);
};
