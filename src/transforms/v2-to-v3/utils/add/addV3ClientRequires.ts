import { Collection, JSCodeshift, ObjectPattern, VariableDeclarator } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import {
  getRequireVariableDeclaration,
  getV2ServiceModulePath,
  getV3ClientRequireProperty,
  getV3ClientTypeNames,
} from "../get";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";

const hasIdentifierName = (varDeclarator: VariableDeclarator, localName: string) =>
  varDeclarator.id.type === "Identifier" && varDeclarator.id.name === localName;

const hasObjectPropertyName = (varDeclarator: VariableDeclarator, localName: string) =>
  varDeclarator.id.type === "ObjectPattern" &&
  (varDeclarator.id as ObjectPattern).properties.some(
    (property) =>
      property.type === "Property" &&
      property.value.type === "Identifier" &&
      property.value.name === localName
  );

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v3ClientName,
    v3ClientPackageName,
    v2GlobalName,
  }: AddV3ClientModulesOptions
): void => {
  const existingRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);

  // Require declaration already exists.
  if (existingRequires && existingRequires.nodes().length > 0) {
    addV3ClientModuleRequire(j, existingRequires, {
      keyName: v3ClientName,
      valueName: v2ClientLocalName,
    });
  } else {
    // Insert after require for global SDK if present. If not, insert after service require.
    const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
    const globalRequireVarDecl = getRequireVariableDeclaration(j, source, PACKAGE_NAME).filter(
      (varDeclaration) => {
        const declarations = varDeclaration.value.declarations.filter(
          (declaration) => declaration.type === "VariableDeclarator"
        ) as VariableDeclarator[];

        if (
          v2GlobalName &&
          declarations.some((declaration) => hasIdentifierName(declaration, v2GlobalName))
        ) {
          return true;
        }

        if (
          declarations.some((declaration) => hasObjectPropertyName(declaration, v2ClientLocalName))
        ) {
          return true;
        }

        return false;
      }
    );
    const serviceRequireVarDecl = getRequireVariableDeclaration(j, source, v2ServiceModulePath);

    const requireVarDecl =
      globalRequireVarDecl.size() > 0 ? globalRequireVarDecl : serviceRequireVarDecl;
    requireVarDecl.at(0).insertAfter(
      j.variableDeclaration("const", [
        j.variableDeclarator(
          j.objectPattern([
            getV3ClientRequireProperty(j, {
              keyName: v3ClientName,
              valueName: v2ClientLocalName,
            }),
          ]),
          j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
        ),
      ])
    );
  }

  // Add require for input/output types, if needed.
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2GlobalName });

  if (v3ClientTypeNames.length > 0) {
    const clientRequires = getRequireVariableDeclaration(j, source, v3ClientPackageName);
    for (const v3ClientTypeName of v3ClientTypeNames.sort()) {
      addV3ClientModuleRequire(j, clientRequires, {
        keyName: v3ClientTypeName,
        valueName: v3ClientTypeName,
      });
    }
  }
};
