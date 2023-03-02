import { Collection, JSCodeshift, ObjectPattern, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { getV3DefaultLocalName } from "../utils";
import { getRequireDeclarators } from "./getRequireDeclarators";
import { getRequireDeclaratorsWithIdentifier } from "./getRequireDeclaratorsWithIdentifier";
import { getRequireProperty } from "./getRequireProperty";
import { getV2RequireDeclarator } from "./getV2RequireDeclarator";
import { objectPatternPropertyCompareFn } from "./objectPatternPropertyCompareFn";
import { ClientModulesOptions, RequirePropertyOptions } from "./types";

export const addClientNamedRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & RequirePropertyOptions
) => {
  const { keyName, v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientPackageName } = options;
  const valueName = options.valueName ?? keyName;

  const v3ClientDefaultLocalName = getV3DefaultLocalName(v2ClientLocalName);
  const v3ClientObjectProperty = getRequireProperty(j, { keyName, valueName });
  const existingRequires = getRequireDeclarators(j, source, v3ClientPackageName);

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
            return key.name === keyName && value.name === valueName;
          })
      )
    ) {
      return;
    }

    const requireDeclaratorsWithIdentifier = getRequireDeclaratorsWithIdentifier(j, source, {
      identifierName: v3ClientDefaultLocalName,
      sourceValue: v3ClientPackageName,
    });

    if (requireDeclaratorsWithIdentifier && requireDeclaratorsWithIdentifier.nodes().length > 0) {
      requireDeclaratorsWithIdentifier.at(0).insertAfter(
        j.variableDeclarator(j.objectPattern([v3ClientObjectProperty]), {
          type: "Identifier",
          name: v3ClientDefaultLocalName,
        })
      );
      return;
    }

    if (existingRequireProperties.length > 0) {
      const firstRequireProperties = (existingRequireProperties[0].id as ObjectPattern).properties;
      firstRequireProperties.push(v3ClientObjectProperty);
      firstRequireProperties.sort(objectPatternPropertyCompareFn);
      return;
    }
  }

  const v3RequireDeclarator = j.variableDeclarator(
    j.objectPattern([v3ClientObjectProperty]),
    j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
  );

  // prettier-ignore
  const v2RequireDeclarator =
    getV2RequireDeclarator(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });

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
