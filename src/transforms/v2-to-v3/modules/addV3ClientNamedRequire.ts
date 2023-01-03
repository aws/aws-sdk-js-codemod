import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";
import { getV2RequireDeclarator } from "./getV2RequireDeclarator";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientNamedRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
    v3ClientName,
    v3ClientPackageName,
  }: V3ClientModulesOptions
) => {
  const v3ClientDefaultLocalName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const v3ClientObjectProperty = getV3ClientRequireProperty(j, {
    keyName: v3ClientName,
    valueName: v2ClientLocalName,
  });
  const existingRequires = getRequireVariableDeclarators(j, source, v3ClientPackageName);

  if (existingRequires && existingRequires.nodes().length > 0) {
    const existingRequireProperties = existingRequires
      .filter((variableDeclarator) => variableDeclarator.value.id.type === "ObjectPattern")
      .nodes();

    if (
      existingRequireProperties.length > 0 &&
      existingRequireProperties.find(
        (variableDeclarator) =>
          variableDeclarator.id.type === "ObjectPattern" &&
          variableDeclarator.id.properties.find(
            (property) =>
              property.type === "Property" &&
              property.key.type === "Identifier" &&
              property.value.type === "Identifier" &&
              property.key.name === v3ClientName &&
              property.value.name === v2ClientLocalName
          )
      )
    ) {
      return;
    }

    const v3ClientDefaultLocalNameIdentifier = {
      type: "Identifier",
      name: v3ClientDefaultLocalName,
    } as Identifier;

    // prettier-ignore
    const v3ClientDefaultLocalNameIdentifierDeclarators =
      getRequireVariableDeclarators(j, source, v3ClientPackageName, v3ClientDefaultLocalNameIdentifier);

    if (
      v3ClientDefaultLocalNameIdentifierDeclarators &&
      v3ClientDefaultLocalNameIdentifierDeclarators.nodes().length > 0
    ) {
      v3ClientDefaultLocalNameIdentifierDeclarators.at(0).insertAfter(
        j.variableDeclarator(j.objectPattern([v3ClientObjectProperty]), {
          type: "Identifier",
          name: v3ClientDefaultLocalName,
        })
      );
      return;
    }

    (existingRequireProperties[0].id as ObjectPattern).properties.push(v3ClientObjectProperty);
  }

  const requireDeclarator = j.variableDeclarator(
    j.objectPattern([v3ClientObjectProperty]),
    j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
  );

  // prettier-ignore
  const v2RequireDeclarator =
    getV2RequireDeclarator(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });

  if (v2RequireDeclarator && v2RequireDeclarator.nodes().length > 0) {
    v2RequireDeclarator.insertAfter(requireDeclarator);
  } else {
    // Insert at the top of the file.
    source.insertBefore(requireDeclarator);
  }
};
