import { Collection, Identifier, JSCodeshift, ObjectProperty } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { addV3ClientDefaultImportEquals } from "./addV3ClientDefaultImportEquals";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientModulesOptions, V3ClientRequirePropertyOptions } from "./types";

export const addV3ClientNamedImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions & V3ClientRequirePropertyOptions
) => {
  const { keyName, valueName, ...v3ClientModulesOptions } = options;
  const { v2ClientLocalName, v3ClientPackageName } = v3ClientModulesOptions;

  const v3ClientDefaultLocalName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const namedImportObjectProperty = getV3ClientRequireProperty(j, { keyName, valueName });

  const existingVarDeclarator = source.find(j.VariableDeclarator, {
    type: "VariableDeclarator",
    init: { type: "Identifier", name: v3ClientDefaultLocalName },
  });

  if (existingVarDeclarator.size()) {
    existingVarDeclarator.get(0).node.id.properties.push(namedImportObjectProperty);
    existingVarDeclarator
      .get(0)
      .node.id.properties.sort((a: ObjectProperty, b: ObjectProperty) =>
        (a.key as Identifier).name.localeCompare((b.key as Identifier).name)
      );
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
