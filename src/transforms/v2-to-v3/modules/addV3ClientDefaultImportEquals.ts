import { Collection, JSCodeshift } from "jscodeshift";

import { getV3DefaultLocalName } from "../utils";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getImportEqualsLocalNameSuffix } from "./getImportEqualsLocalNameSuffix";
import { getV2ImportEqualsDeclaration } from "./getV2ImportEqualsDeclaration";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientDefaultImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2ClientName, v2GlobalName, v3ClientPackageName }: V3ClientModulesOptions
) => {
  const localNameSuffix = getImportEqualsLocalNameSuffix(v2ClientName, v3ClientPackageName);
  const v3ClientDefaultLocalName = getV3DefaultLocalName(localNameSuffix);
  const existingImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclaration(v3ClientPackageName)
  );

  if (existingImportEquals.size()) {
    if (
      existingImportEquals
        .nodes()
        .some(
          (importEqualsDeclaration) => importEqualsDeclaration.id.name === v3ClientDefaultLocalName
        )
    ) {
      return;
    }
  }

  // Insert after global, or service import equals.
  const v2ImportEqualsDeclaration = getV2ImportEqualsDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
  }).at(0);

  const importDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(v3ClientDefaultLocalName),
    j.tsExternalModuleReference(j.stringLiteral(v3ClientPackageName))
  );

  if (v2ImportEqualsDeclaration && v2ImportEqualsDeclaration.nodes().length > 0) {
    v2ImportEqualsDeclaration.at(0).insertAfter(importDeclaration);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Import Equals Declaration not found to insert new Import Declaration.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
