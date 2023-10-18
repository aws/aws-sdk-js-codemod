import { Collection, JSCodeshift } from "jscodeshift";

import { getImportEqualsDeclarationType } from "../getImportEqualsDeclarationType";
import { ClientModulesOptions, ImportSpecifierOptions } from "../types";
import { addClientDefaultModule } from "./addClientDefaultModule";
import { getImportEqualsDefaultName } from "./getImportEqualsDefaultName";

export const addClientNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & ImportSpecifierOptions
) => {
  const { importedName, localName = importedName, ...v3ClientModulesOptions } = options;
  const { v3ClientPackageName } = v3ClientModulesOptions;

  const defaultLocalName = getImportEqualsDefaultName(v3ClientPackageName);

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

  const defaultDeclaration = getImportEqualsDeclarationType(v3ClientPackageName);
  if (source.find(j.TSImportEqualsDeclaration, defaultDeclaration).size() === 0) {
    addClientDefaultModule(j, source, v3ClientModulesOptions);
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

  if (v3ClientImportEquals.size() > 0) {
    v3ClientImportEquals.at(0).insertAfter(importEqualsDeclaration);
    return;
  }

  // Unreachable code, throw error
  throw new Error(
    "The named import equals can't exist on it's own.\n" +
      "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
  );
};
