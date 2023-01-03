import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";
import { getV2RequireDeclarator } from "./getV2RequireDeclarator";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientDefaultRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v3ClientPackageName, v2GlobalName }: V3ClientModulesOptions
) => {
  const identifierName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const existingRequires = getRequireVariableDeclarators(j, source, v3ClientPackageName);

  if (
    existingRequires &&
    existingRequires.nodes().length > 0 &&
    existingRequires
      .nodes()
      .find(
        (variableDeclarator) =>
          variableDeclarator.id.type === "Identifier" &&
          variableDeclarator.id.name === identifierName
      )
  ) {
    return;
  }

  // prettier-ignore
  const v2RequireDeclarator =
    getV2RequireDeclarator(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });

  const requireDeclarator = j.variableDeclarator(
    j.identifier(identifierName),
    j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
  );

  if (v2RequireDeclarator && v2RequireDeclarator.nodes().length > 0) {
    v2RequireDeclarator.insertAfter(requireDeclarator);
  } else {
    // Insert at the top of the file.
    source.insertBefore(requireDeclarator);
  }
};
