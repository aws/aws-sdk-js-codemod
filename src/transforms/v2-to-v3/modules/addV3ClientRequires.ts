import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientTypeNames } from "../ts-type";
import { addV3ClientModuleRequire } from "./addV3ClientModuleRequire";
import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";
import { getV2RequireDeclarator } from "./getV2RequireDeclarator";
import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientModulesOptions } from "./types";

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
  const existingRequires = getRequireVariableDeclarators(j, source, v3ClientPackageName);

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

    // prettier-ignore
    const v2RequireDeclarator =
      getV2RequireDeclarator(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });

    if (v2RequireDeclarator && v2RequireDeclarator.nodes().length > 0) {
      v2RequireDeclarator.insertAfter(requireDeclarator);
    } else {
      // Insert at the top of the file.
      source.insertBefore(requireDeclarator);
    }
  }

  // Add require for input/output types, if needed.
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2GlobalName });

  if (v3ClientTypeNames.length > 0) {
    const clientRequires = getRequireVariableDeclarators(j, source, v3ClientPackageName);
    for (const v3ClientTypeName of v3ClientTypeNames.sort()) {
      addV3ClientModuleRequire(j, clientRequires, {
        keyName: v3ClientTypeName,
        valueName: v3ClientTypeName,
      });
    }
  }
};
