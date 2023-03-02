import { Collection, JSCodeshift } from "jscodeshift";

import { getDefaultLocalName } from "../utils";
import { getRequireDeclarators } from "./getRequireDeclarators";
import { getV2RequireDeclarator } from "./getV2RequireDeclarator";
import { ClientModulesOptions } from "./types";

export const addClientDefaultRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v3ClientPackageName, v2GlobalName }: ClientModulesOptions
) => {
  const identifierName = getDefaultLocalName(v2ClientLocalName);
  const existingRequires = getRequireDeclarators(j, source, v3ClientPackageName);

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

  const v3RequireDeclarator = j.variableDeclarator(
    j.identifier(identifierName),
    j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
  );

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
