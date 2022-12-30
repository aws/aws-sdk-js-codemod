import {
  CallExpression,
  Collection,
  JSCodeshift,
  VariableDeclaration,
  VariableDeclarator,
} from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import {
  getRequireVariableDeclaration,
  getV2ServiceModulePath,
  getV3ClientRequireProperty,
  getV3ClientTypeNames,
} from "../get";
import { hasPropertyWithName } from "../has";
import { ClientCodemodOptions } from "../types";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";

const getRequiresWithArgument = (
  existingRequires: Collection<VariableDeclaration>,
  argumentValue: string
) =>
  existingRequires.filter((varDeclaration) =>
    varDeclaration.value.declarations.some((varDeclarator) => {
      const init = (varDeclarator as VariableDeclarator).init as CallExpression;
      const argument = init?.arguments[0];
      if (argument.type !== "Literal" && argument.type !== "StringLiteral") return false;
      return argument.value === argumentValue;
    })
  );

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, clientMetadataRecord }: ClientCodemodOptions
): void => {
  const existingRequires = getRequireVariableDeclaration(j, source);
  const globalRequires = getRequiresWithArgument(existingRequires, PACKAGE_NAME);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const clientRequires = getRequiresWithArgument(existingRequires, v3ClientPackageName);

    // Require declaration already exists.
    if (clientRequires && clientRequires.nodes().length > 0) {
      addV3ClientModuleRequire(j, clientRequires, {
        keyName: v3ClientName,
        valueName: v2ClientLocalName,
      });
    } else {
      // Insert after require for global SDK if present. If not, insert after service require.
      const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
      const globalRequireVarDecl = globalRequires.filter((varDeclaration) =>
        hasPropertyWithName(varDeclaration, {
          identifierName: v2GlobalName,
          objectPropertyName: v2ClientLocalName,
        })
      );
      const serviceRequireVarDecl = getRequiresWithArgument(existingRequires, v2ServiceModulePath);

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
  }
};
