import { Collection, JSCodeshift } from "jscodeshift";

import { ModulesOptions } from "../types";
import { addDefaultModule } from "./addDefaultModule";
import { getDefaultName } from "./getDefaultName";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";
import { getImportSpecifiers } from "./getImportSpecifiers";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { localName, importedName = localName, packageName } = options;

  const defaultLocalName = getDefaultName(packageName);

  const existingDeclaration = source.find(j.TSImportEqualsDeclaration, {
    type: "TSImportEqualsDeclaration",
    id: { type: "Identifier", name: localName },
    moduleReference: {
      type: "TSQualifiedName",
      left: { type: "Identifier", name: defaultLocalName },
      right: { type: "Identifier", name: importedName },
    },
  });

  if (existingDeclaration.size()) {
    return;
  }

  if (getImportSpecifiers(j, source, packageName).length === 0) {
    addDefaultModule(j, source, packageName);
  }

  const importEqualsDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(localName),
    j.tsQualifiedName(j.identifier(defaultLocalName), j.identifier(importedName))
  );

  const v3ClientImportEquals = getImportEqualsDeclarations(j, source, packageName).filter(
    (importEqualsDeclaration) => importEqualsDeclaration.value.id.name === defaultLocalName
  );

  // Insert import equals after the package import equals.
  if (v3ClientImportEquals.size() > 0) {
    v3ClientImportEquals.at(0).insertAfter(importEqualsDeclaration);
    return;
  }

  // Unreachable code, throw error
  throw new Error(
    "The named import equals can't exist on it's own.\n" +
      "Please report your use case on https://github.com/aws/aws-sdk-js-codemod"
  );
};
