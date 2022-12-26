import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  Property,
  VariableDeclarator,
} from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getRequireVariableDeclaration, getV2ServiceModulePath, getV3ClientTypes } from "../get";
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

  const existingRequire = getRequireVariableDeclaration(j, source, v3ClientPackageName);

  // Require declaration already exists.
  if (existingRequire && existingRequire.nodes().length > 0) {
    existingRequire
      .nodes()[0]
      .declarations.filter((declaration) => declaration.type === "VariableDeclarator")
      .forEach((variableDeclarator) => {
        // Append to existing require if property not present.
        if (
          !((variableDeclarator as VariableDeclarator).id as ObjectPattern).properties.find(
            (property) => ((property as Property).key as Identifier).name === v3ClientName
          )
        ) {
          ((variableDeclarator as VariableDeclarator).id as ObjectPattern).properties.push(
            v3ClientNameProperty
          );
        }
      });
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
    const clientRequire = getRequireVariableDeclaration(j, source, v3ClientPackageName);
    for (const clientTsType of v3ClientTypes.sort()) {
      const clientsTypename = (clientTsType.typeName as Identifier).name;
      if (clientsTypename.endsWith("CommandInput") || clientsTypename.endsWith("CommandOutput")) {
        const clientsTypenameIdentifier = j.identifier(clientsTypename);
        (
          (clientRequire.nodes()[0].declarations[0] as VariableDeclarator).id as ObjectPattern
        ).properties.push(
          j.property.from({
            kind: "init",
            key: clientsTypenameIdentifier,
            shorthand: true,
            value: clientsTypenameIdentifier,
          })
        );
      }
    }
  }
};
