import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getRequireVariableDeclaration, getV2ServiceModulePath } from "../get";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v3ClientPackageName }: AddV3ClientModulesOptions
): void => {
  const existingRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);

  // Require declaration already exists.
  if (existingRequires && existingRequires.nodes().length > 0) {
    const containsRequireWithLocalName = existingRequires
      .nodes()
      .map((node) =>
        node.declarations.filter(
          (declaration) => (declaration as VariableDeclarator).id.type === "Identifier"
        )
      )
      .flat()
      .some(
        (variableDeclarator) =>
          ((variableDeclarator as VariableDeclarator).id as Identifier).name === v2ClientLocalName
      );

    if (containsRequireWithLocalName) {
      return;
    }
  }

  // Insert after require for global SDK if present. If not, insert after service require.
  const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
  const globalRequireVarDecl = getRequireVariableDeclaration(j, source, PACKAGE_NAME);
  const serviceRequireVarDecl = getRequireVariableDeclaration(j, source, v2ServiceModulePath);

  const requireVarDecl =
    globalRequireVarDecl.size() > 0 ? globalRequireVarDecl : serviceRequireVarDecl;

  requireVarDecl
    .at(0)
    .insertAfter(
      j.variableDeclaration("const", [
        j.variableDeclarator(
          j.identifier(v2ClientLocalName),
          j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
        ),
      ])
    );
};
