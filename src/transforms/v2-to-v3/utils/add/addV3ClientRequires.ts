import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import {
  getRequireVariableDeclaration,
  getV2ServiceModulePath,
  getV3ClientTypeNames,
} from "../get";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";

const getClientProperty = (j: JSCodeshift, name: Identifier) =>
  j.property.from({
    kind: "init",
    key: name,
    shorthand: true,
    value: name,
  });

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
  const v3ClientNameProperty = getClientProperty(j, j.identifier(v3ClientName));
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
    requireVarDecl
      .at(0)
      .insertAfter(
        j.variableDeclaration("const", [
          j.variableDeclarator(
            j.objectPattern([v3ClientNameProperty]),
            j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
          ),
        ])
      );
  }

  // Add require for input/output types, if needed.
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2DefaultModuleName });

  if (v3ClientTypeNames.length > 0) {
    const clientRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);
    for (const v3ClientTypeName of v3ClientTypeNames.sort()) {
      const v3ClientTypeNameProperty = getClientProperty(j, j.identifier(v3ClientTypeName));
      addV3ClientModuleRequire(j, clientRequires, v3ClientTypeNameProperty);
    }
  }
};
