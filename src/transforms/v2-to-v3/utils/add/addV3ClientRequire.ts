import { Collection, Identifier, JSCodeshift, ObjectPattern, Property } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getRequireVariableDeclaration, getV2ServiceModulePath } from "../get";
import { AddV3ClientModuleOptions } from "./addV3ClientModule";

export const addV3ClientRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v3ClientName, v3ClientPackageName }: AddV3ClientModuleOptions
): void => {
  const v3ClientNameIdentifier = j.identifier(v3ClientName);
  const v3ClientNameProperty = j.property.from({
    kind: "init",
    key: v3ClientNameIdentifier,
    shorthand: true,
    value: v3ClientNameIdentifier,
  });

  const existingRequires = source.find(j.VariableDeclarator, {
    id: { type: "ObjectPattern" },
    init: {
      type: "CallExpression",
      callee: { type: "Identifier", name: "require" },
      arguments: [{ value: v3ClientPackageName }],
    },
  });

  // Require declaration already exists.
  if (existingRequires.size()) {
    existingRequires.forEach((nodePath) => {
      // Append to existing require if property not present.
      if (
        !(nodePath.value.id as ObjectPattern).properties.find(
          (property) => ((property as Property).key as Identifier).name === v3ClientName
        )
      ) {
        (nodePath.value.id as ObjectPattern).properties.push(v3ClientNameProperty);
      }
    });
    return;
  }

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
};
