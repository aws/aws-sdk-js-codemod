import { CallExpression, Collection, JSCodeshift, VariableDeclarator } from "jscodeshift";

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

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, clientMetadataRecord }: ClientCodemodOptions
): void => {
  const existingRequires = getRequireVariableDeclaration(j, source);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const existingRequiresForClient = existingRequires.filter((varDeclaration) => {
      return varDeclaration.value.declarations.some((varDeclarator) => {
        const init = (varDeclarator as VariableDeclarator).init as CallExpression;
        const argument = init?.arguments[0];
        if (argument.type !== "Literal") return false;
        return argument.value === v3ClientPackageName;
      });
    });

    // Require declaration already exists.
    if (existingRequiresForClient && existingRequiresForClient.nodes().length > 0) {
      addV3ClientModuleRequire(j, existingRequiresForClient, {
        keyName: v3ClientName,
        valueName: v2ClientLocalName,
      });
    } else {
      // Insert after require for global SDK if present. If not, insert after service require.
      const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
      const globalRequireVarDecl = getRequireVariableDeclaration(j, source, PACKAGE_NAME).filter(
        (varDeclaration) =>
          hasPropertyWithName(varDeclaration, {
            identifierName: v2GlobalName,
            objectPropertyName: v2ClientLocalName,
          })
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
  }
};
