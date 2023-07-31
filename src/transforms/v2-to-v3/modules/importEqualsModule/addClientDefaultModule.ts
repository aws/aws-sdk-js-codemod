import { Collection, JSCodeshift } from "jscodeshift";

import { getDefaultLocalName } from "../../utils";
import { getImportEqualsDeclaration } from "../getImportEqualsDeclaration";
import { getImportEqualsDeclarationType } from "../getImportEqualsDeclarationType";
import { getImportEqualsLocalNameSuffix } from "../getImportEqualsLocalNameSuffix";
import { ClientModulesOptions } from "../types";

export const addClientDefaultModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2ClientName, v2GlobalName, v3ClientPackageName }: ClientModulesOptions
) => {
  const localNameSuffix = getImportEqualsLocalNameSuffix(v2ClientName, v3ClientPackageName);
  const defaultLocalName = getDefaultLocalName(localNameSuffix);
  const existingImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclarationType(v3ClientPackageName)
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

  // Insert after global, or service import equals.
  const v2ImportEqualsDeclaration = getImportEqualsDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
  }).at(0);

  const v3importEqualsDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(defaultLocalName),
    j.tsExternalModuleReference(j.stringLiteral(v3ClientPackageName))
  );

  if (v2ImportEqualsDeclaration && v2ImportEqualsDeclaration.nodes().length > 0) {
    v2ImportEqualsDeclaration.at(0).insertAfter(v3importEqualsDeclaration);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Import Equals Declaration not found to insert new Import Declaration.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
