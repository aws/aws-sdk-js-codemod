import { Collection, Identifier, JSCodeshift, ObjectPattern, Property } from "jscodeshift";

import { AddV3ClientModuleOptions } from "./addV3ClientModule";
import { PACKAGE_NAME } from "./config";
import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";

export const addV3ClientRequire = (
  j: JSCodeshift,
  source: Collection<any>,
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
      arguments: [{ type: "Literal", value: v3ClientPackageName }],
    },
  });

  // Require decleration already exists.
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

  // Insert after default require if present. If not, insert after client require.
  const clientRequireValue = `aws-sdk/clients/${v2ClientName.toLowerCase()}`;
  const defaultRequireVarDeclaration = getRequireVariableDeclaration(j, source, PACKAGE_NAME);
  const clientRequireVarDeclaration = getRequireVariableDeclaration(j, source, clientRequireValue);

  const requireVarDeclaration =
    defaultRequireVarDeclaration.size() > 0
      ? defaultRequireVarDeclaration
      : clientRequireVarDeclaration;
  requireVarDeclaration.insertAfter(
    j.variableDeclaration("const", [
      j.variableDeclarator(
        j.objectPattern([v3ClientNameProperty]),
        j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
      ),
    ])
  );
};
