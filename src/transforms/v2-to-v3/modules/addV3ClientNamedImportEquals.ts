import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientModulesOptions, V3ClientRequirePropertyOptions } from "./types";

export const addV3ClientNamedImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    keyName,
    valueName,
    v2ClientLocalName,
    v3ClientPackageName,
  }: V3ClientModulesOptions & V3ClientRequirePropertyOptions
) => {
  const v3ClientDefaultLocalName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const objectProperty = getV3ClientRequireProperty(j, { keyName, valueName });

  const existingVarDeclarator = source.find(j.VariableDeclarator, {
    type: "VariableDeclarator",
    init: {
      type: "Identifier",
      name: v3ClientDefaultLocalName,
    },
  });

  if (existingVarDeclarator.size()) {
    existingVarDeclarator.get(0).node.id.properties.push(objectProperty);
    return;
  }

  const existingImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclaration(v3ClientPackageName)
  );

  const varDeclaration = j.variableDeclaration("const", [
    j.variableDeclarator(j.objectPattern([objectProperty]), j.identifier(v3ClientDefaultLocalName)),
  ]);

  if (existingImportEquals.size()) {
    const v3ClientImportEquals = existingImportEquals.filter(
      (importEqualsDeclaration) =>
        importEqualsDeclaration.value.id.name === v3ClientDefaultLocalName
    );

    if (v3ClientImportEquals.size() > 0) {
      v3ClientImportEquals.at(0).insertAfter(varDeclaration);
      return;
    }
  }

  // Unreachable code, throw error
  throw new Error(
    "The named import equals can't exist on it's own.\n" +
      "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
  );
};
