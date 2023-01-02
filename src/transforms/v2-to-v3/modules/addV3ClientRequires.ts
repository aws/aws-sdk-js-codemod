import { Collection, JSCodeshift, ObjectPattern, VariableDeclarator } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV3ClientTypeNames } from "../ts-type";
import { getV2ServiceModulePath, hasIdentifierName } from "../utils";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";
import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientModulesOptions } from "./types";

const insertAfterIdentifierName = (
  j: JSCodeshift,
  varDeclarators: Collection<VariableDeclarator>,
  varDeclartor: VariableDeclarator,
  identifierName: string
) => {
  for (const varDeclarator of varDeclarators) {
    for (const varDeclaration of varDeclarator.value.declarations) {
      if (varDeclaration.id.type === "Identifier" && varDeclaration.id.name === identifierName) {
        varDeclaration.insertAfter(varDeclartor);
      }
    }
  }
};

const insertAfterObjectPropertyName = (
  j: JSCodeshift,
  varDeclarations: VariableDeclarator[],
  varDeclartor: VariableDeclarator,
  objectPropertyName: string
) => {
  for (const varDeclarator of varDeclarations) {
    if (
      varDeclarator.id.type === "ObjectPattern" &&
      (varDeclarator.id as ObjectPattern).properties.some(
        (property) =>
          property.type === "Property" &&
          property.value.type === "Identifier" &&
          property.value.name === objectPropertyName
      )
    ) {
      j(varDeclarator).insertAfter(varDeclartor);
    }
  }
};

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v3ClientName,
    v3ClientPackageName,
    v2GlobalName,
  }: V3ClientModulesOptions
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
    const requireDeclarator = j.variableDeclarator(
      j.objectPattern([
        getV3ClientRequireProperty(j, {
          keyName: v3ClientName,
          valueName: v2ClientLocalName,
        }),
      ]),
      j.callExpression(j.identifier("require"), [j.literal(v3ClientPackageName)])
    );

    const globalDeclarations = getRequireVariableDeclaration(j, source, PACKAGE_NAME);

    if (
      v2GlobalName &&
      globalDeclarations.some((declarator) => hasIdentifierName(declarator.node, v2GlobalName))
    ) {
      insertAfterIdentifierName(j, globalDeclarations, requireDeclarator, v2GlobalName);
    } else if (
      globalDeclarations.some((declarator) => hasObjectPropertyName(declarator, v2ClientLocalName))
    ) {
      insertAfterObjectPropertyName(j, globalDeclarations, requireDeclarator, v2ClientLocalName);
    } else {
      const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
      const serviceDeclarations = getVariableDeclarators(j, source, v2ServiceModulePath);

      if (
        serviceDeclarations.some((declarator) => hasIdentifierName(declarator, v2ClientLocalName))
      ) {
        insertAfterIdentifierName(j, serviceDeclarations, requireDeclarator, v2ClientLocalName);
      } else {
        // Insert at the top of the file.
        source.insertBefore(j.variableDeclaration("const", [requireDeclarator]));
      }
    }
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
