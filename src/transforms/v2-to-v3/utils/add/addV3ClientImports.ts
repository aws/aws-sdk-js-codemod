import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath, getV3ClientTypes } from "../get";
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
    const existingImportSpecifiers = existingImports
      .nodes()
      .map((importDeclaration) => importDeclaration.specifiers)
      .flat();
    if (!existingImportSpecifiers.find((specifier) => specifier?.local?.name === v3ClientName)) {
      existingImports.nodes()[0].specifiers?.push(j.importSpecifier(j.identifier(v3ClientName)));
    }
  } else {
    // Insert after default import if present. If not, insert after service import.
    source
      .find(j.ImportDeclaration)
      .filter(
        (path) =>
          path.value.source.value === PACKAGE_NAME ||
          path.value.source.value === getV2ServiceModulePath(v2ClientName)
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
    for (const clientTsType of v3ClientTypes.sort()) {
      const clientsTypename = (clientTsType.typeName as Identifier).name;
      if (clientsTypename.endsWith("CommandInput") || clientsTypename.endsWith("CommandOutput")) {
        clientImports.forEach((nodePath) => {
          // Append to existing import if specifier not present.
          if (
            !nodePath.value.specifiers?.find(
              (specifier) => specifier.local?.name === clientsTypename
            )
          ) {
            nodePath.value.specifiers?.push(j.importSpecifier(j.identifier(clientsTypename)));
          }
        });
      }
    }
  }
};
