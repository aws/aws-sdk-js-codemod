import { Collection, JSCodeshift } from "jscodeshift";

import { getImportEqualsDeclarationType } from "../getImportEqualsDeclarationType";
import { ModulesOptions } from "../types";
import { addDefaultModule } from "./addDefaultModule";
import { getDefaultName } from "./getDefaultName";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { importedName, localName = importedName, packageName } = options;

  const defaultLocalName = getDefaultName(packageName);

  const existingDeclaration = source.find(j.TSImportEqualsDeclaration, {
    type: "TSImportEqualsDeclaration",
    id: {
      type: "Identifier",
      name: localName,
    },
    moduleReference: {
      type: "TSQualifiedName",
      left: {
        type: "Identifier",
        name: defaultLocalName,
      },
      right: {
        type: "Identifier",
        name: importedName,
      },
    },
  });

  if (existingDeclaration.size()) {
    return;
  }

  const defaultDeclaration = getImportEqualsDeclarationType(packageName);
  if (source.find(j.TSImportEqualsDeclaration, defaultDeclaration).size() === 0) {
    addDefaultModule(j, source, packageName);
  }

  const importEqualsDeclaration = j.tsImportEqualsDeclaration(
    j.identifier(localName),
    j.tsQualifiedName(j.identifier(defaultLocalName), j.identifier(importedName))
  );

  const v3ClientImportEquals = source
    .find(j.TSImportEqualsDeclaration, defaultDeclaration)
    .filter(
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
