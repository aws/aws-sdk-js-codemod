import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getRequireVariableDeclaration, getV2ServiceModulePath, getV3ClientTypes } from "../get";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";
export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v3ClientName,
    v3ClientPackageName,
    v2DefaultModuleName,
  }: AddV3ClientModulesOptions
): void => {
  const v3ClientNameIdentifier = j.identifier(v3ClientName);
  const v3ClientNameProperty = j.property.from({
    kind: "init",
    key: v3ClientNameIdentifier,
    shorthand: true,
    value: v3ClientNameIdentifier,
  });

  const existingRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);

  // Require declaration already exists.
  if (existingRequires && existingRequires.nodes().length > 0) {
    addV3ClientModuleRequire(j, existingRequires, v3ClientNameProperty);
  } else {
    // Insert after default require if present. If not, insert after service require.
    const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
    const defaultRequireVarDecl = getRequireVariableDeclaration(j, source, PACKAGE_NAME);
    const serviceRequireVarDecl = getRequireVariableDeclaration(j, source, v2ServiceModulePath);

    const requireVarDecl =
      defaultRequireVarDecl.size() > 0 ? defaultRequireVarDecl : serviceRequireVarDecl;
    requireVarDecl.insertAfter(
      j.variableDeclaration("const", [
        j.variableDeclarator(
          j.objectPattern([v3ClientNameProperty]),
          j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
        ),
      ])
    );
  }

  // Add require for input/output types, if needed.
  const v3ClientTypes = getV3ClientTypes(j, source, { v2ClientName, v2DefaultModuleName });

  if (v3ClientTypes.length > 0) {
    const clientRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);
    for (const clientTsType of v3ClientTypes.sort()) {
      const clientsTypename = (clientTsType.typeName as Identifier).name;
      if (clientsTypename.endsWith("CommandInput") || clientsTypename.endsWith("CommandOutput")) {
        const clientsTypenameIdentifier = j.identifier(clientsTypename);
        const clientsTypenameProperty = j.property.from({
          kind: "init",
          key: clientsTypenameIdentifier,
          shorthand: true,
          value: clientsTypenameIdentifier,
        });
        addV3ClientModuleRequire(j, clientRequires, clientsTypenameProperty);
      }
    }
  }
};
