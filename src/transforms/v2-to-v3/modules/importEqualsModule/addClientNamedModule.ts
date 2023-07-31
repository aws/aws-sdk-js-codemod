import { Collection, JSCodeshift } from "jscodeshift";

import { getDefaultLocalName } from "../../utils";
import { getImportEqualsDeclarationType } from "../getImportEqualsDeclarationType";
import { getImportEqualsLocalNameSuffix } from "../getImportEqualsLocalNameSuffix";
import { getRequireProperty } from "../getRequireProperty";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { ClientModulesOptions, ImportSpecifierOptions } from "../types";
import { addClientDefaultModule } from "./addClientDefaultModule";

export const addClientNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & ImportSpecifierOptions
) => {
  const { importedName, localName, ...v3ClientModulesOptions } = options;
  const { v2ClientName, v3ClientPackageName } = v3ClientModulesOptions;

  const localNameSuffix = getImportEqualsLocalNameSuffix(v2ClientName, v3ClientPackageName);
  const defaultLocalName = getDefaultLocalName(localNameSuffix);
  const namedImportObjectProperty = getRequireProperty(j, { importedName, localName });

  const existingVarDeclarator = source.find(j.VariableDeclarator, {
    type: "VariableDeclarator",
    init: { type: "Identifier", name: defaultLocalName },
  });

  if (existingVarDeclarator.size()) {
    const firstDeclaratorProperties = existingVarDeclarator.get(0).node.id.properties;
    firstDeclaratorProperties.push(namedImportObjectProperty);
    firstDeclaratorProperties.sort(objectPatternPropertyCompareFn);
    return;
  }

  const importEqualsDeclaration = getImportEqualsDeclarationType(v3ClientPackageName);
  if (source.find(j.TSImportEqualsDeclaration, importEqualsDeclaration).size() === 0) {
    addClientDefaultModule(j, source, v3ClientModulesOptions);
  }

  const varDeclaration = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.objectPattern([namedImportObjectProperty]),
      j.identifier(defaultLocalName)
    ),
  ]);

  const v3ClientImportEquals = source
    .find(j.TSImportEqualsDeclaration, importEqualsDeclaration)
    .filter(
      (importEqualsDeclaration) => importEqualsDeclaration.value.id.name === defaultLocalName
    );

  if (v3ClientImportEquals.size() > 0) {
    v3ClientImportEquals.at(0).insertAfter(varDeclaration);
    return;
  }

  // Unreachable code, throw error
  throw new Error(
    "The named import equals can't exist on it's own.\n" +
      "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
  );
};
