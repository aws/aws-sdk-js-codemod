import { Collection, JSCodeshift, ObjectPattern, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME } from "../../config";
import { getDefaultLocalName } from "../../utils";
import { getRequireDeclarators } from "../getRequireDeclarators";
import { getRequireDeclaratorsWithIdentifier } from "../getRequireDeclaratorsWithIdentifier";
import { getRequireProperty } from "../getRequireProperty";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { ModulesOptions } from "../types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { importedName, packageName } = options;
  const localName = options.localName ?? importedName;

  const defaultLocalName = getDefaultLocalName(localName);
  const clientObjectProperty = getRequireProperty(j, { importedName, localName });
  const existingRequires = getRequireDeclarators(j, source, packageName);

  if (existingRequires && existingRequires.nodes().length > 0) {
    const existingRequireProperties = existingRequires
      .filter((variableDeclarator) => variableDeclarator.value.id.type === "ObjectPattern")
      .nodes();

    if (
      existingRequireProperties.length > 0 &&
      existingRequireProperties.find(
        (variableDeclarator) =>
          variableDeclarator.id.type === "ObjectPattern" &&
          variableDeclarator.id.properties.find((property) => {
            if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return false;
            const key = (property as Property | ObjectProperty).key;
            const value = (property as Property | ObjectProperty).value;
            if (key.type !== "Identifier" || value.type !== "Identifier") {
              return false;
            }
            return key.name === importedName && value.name === localName;
          })
      )
    ) {
      return;
    }

    const requireDeclaratorsWithIdentifier = getRequireDeclaratorsWithIdentifier(j, source, {
      identifierName: defaultLocalName,
      sourceValue: packageName,
    });

    if (requireDeclaratorsWithIdentifier && requireDeclaratorsWithIdentifier.nodes().length > 0) {
      requireDeclaratorsWithIdentifier.at(0).insertAfter(
        j.variableDeclarator(j.objectPattern([clientObjectProperty]), {
          type: "Identifier",
          name: defaultLocalName,
        })
      );
      return;
    }

    if (existingRequireProperties.length > 0) {
      const firstRequireProperties = (existingRequireProperties[0].id as ObjectPattern).properties;
      firstRequireProperties.push(clientObjectProperty);
      firstRequireProperties.sort(objectPatternPropertyCompareFn);
      return;
    }
  }

  const v3RequireDeclarator = j.variableDeclarator(
    j.objectPattern([clientObjectProperty]),
    j.callExpression(j.identifier("require"), [j.literal(packageName)])
  );

  const v2RequireDeclarator = getRequireDeclarators(j, source, PACKAGE_NAME);

  if (v2RequireDeclarator && v2RequireDeclarator.nodes().length > 0) {
    v2RequireDeclarator.insertAfter(v3RequireDeclarator);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Require Declarator not found to insert new Require Declarator.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
