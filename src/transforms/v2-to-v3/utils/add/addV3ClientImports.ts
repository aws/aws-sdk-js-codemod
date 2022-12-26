import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath, getV3ClientTypes } from "../get";
import { addV3ClientModuleImport } from "./addV3ClientModuleImport";
import { AddV3ClientModulesOptions } from "./addV3ClientModules";

export const addV3ClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v3ClientName,
    v3ClientPackageName,
    v2DefaultModuleName,
  }: AddV3ClientModulesOptions
): void => {
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  // Import declaration already exists.
  if (existingImports.size()) {
    addV3ClientModuleImport(j, existingImports, v3ClientName);
  } else {
    // Insert after default import or service import, whichever comes first.
    source
      .find(j.ImportDeclaration)
      .filter((path) =>
        [PACKAGE_NAME, getV2ServiceModulePath(v2ClientName)].includes(
          path.value.source.value as string
        )
      )
      .at(0)
      .insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier(v3ClientName))],
          j.stringLiteral(v3ClientPackageName)
        )
      );
  }

  // Add require for input/output types, if needed.
  const v3ClientTypes = getV3ClientTypes(j, source, { v2ClientName, v2DefaultModuleName });

  if (v3ClientTypes.length > 0) {
    const clientImports = source.find(j.ImportDeclaration, {
      source: { value: v3ClientPackageName },
    });
    for (const v3ClientType of v3ClientTypes.sort()) {
      const v3ClientTypeName = (v3ClientType.typeName as Identifier).name;
      if (v3ClientTypeName.endsWith("CommandInput") || v3ClientTypeName.endsWith("CommandOutput")) {
        addV3ClientModuleImport(j, clientImports, v3ClientTypeName);
      }
    }
  }
};
