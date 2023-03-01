import { Collection, JSCodeshift } from "jscodeshift";

import { getV3DefaultLocalName } from "../utils";
import { addV3ClientDefaultImportEquals } from "./addV3ClientDefaultImportEquals";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { objectPatternPropertyCompareFn } from "./objectPatternPropertyCompareFn";
import { V3ClientModulesOptions, V3ClientRequirePropertyOptions } from "./types";

export const addV3ClientNamedImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions & V3ClientRequirePropertyOptions
) => {
  const { keyName, valueName, ...v3ClientModulesOptions } = options;
  const { v2ClientName, v3ClientPackageName } = v3ClientModulesOptions;

  const localNameSuffix = v3ClientPackageName.startsWith("@aws-sdk/client-")
    ? v2ClientName
    : v3ClientPackageName.substring(9).replace(/-/g, "_");
  const v3ClientDefaultLocalName = getV3DefaultLocalName(localNameSuffix);
  const namedImportObjectProperty = getV3ClientRequireProperty(j, { keyName, valueName });

  const existingVarDeclarator = source.find(j.VariableDeclarator, {
    type: "VariableDeclarator",
    init: { type: "Identifier", name: v3ClientDefaultLocalName },
  });

  if (existingVarDeclarator.size()) {
    const firstDeclaratorProperties = existingVarDeclarator.get(0).node.id.properties;
    firstDeclaratorProperties.push(namedImportObjectProperty);
    firstDeclaratorProperties.sort(objectPatternPropertyCompareFn);
    return;
  }

  const importEqualsDeclaration = getImportEqualsDeclaration(v3ClientPackageName);
  if (source.find(j.TSImportEqualsDeclaration, importEqualsDeclaration).size() === 0) {
    addV3ClientDefaultImportEquals(j, source, v3ClientModulesOptions);
  }

  const varDeclaration = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.objectPattern([namedImportObjectProperty]),
      j.identifier(v3ClientDefaultLocalName)
    ),
  ]);

  const v3ClientImportEquals = source
    .find(j.TSImportEqualsDeclaration, importEqualsDeclaration)
    .filter(
      (importEqualsDeclaration) =>
        importEqualsDeclaration.value.id.name === v3ClientDefaultLocalName
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
