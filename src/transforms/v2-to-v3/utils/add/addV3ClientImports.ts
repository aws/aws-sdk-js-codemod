import { Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getTsTypeWithInputOutput, getV2ServiceModulePath } from "../get";
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
    existingImports.forEach((nodePath) => {
      // Append to existing import if specifier not present.
      if (!nodePath.value.specifiers?.find((specifier) => specifier.local?.name === v3ClientName)) {
        nodePath.value.specifiers?.push(j.importSpecifier(j.identifier(v3ClientName)));
      }
    });
  } else {
    // Insert after default import if present. If not, insert after service import.
    source
      .find(j.ImportDeclaration)
      .filter(
        (path) =>
          path.value.source.value === PACKAGE_NAME ||
          path.value.source.value === getV2ServiceModulePath(v2ClientName)
      )
      .insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier(v3ClientName))],
          j.stringLiteral(v3ClientPackageName)
        )
      );
  }

  // Add require for input/output types, if needed.
  const clientTsTypes = source
    .find(j.TSTypeReference, {
      typeName: {
        left: {
          left: { type: "Identifier", name: v2DefaultModuleName },
          right: { type: "Identifier", name: v2ClientName },
        },
      },
    })
    .nodes()
    .map((tsTypeRef) =>
      getTsTypeWithInputOutput(
        j,
        tsTypeRef,
        ((tsTypeRef.typeName as TSQualifiedName).right as Identifier).name
      )
    );

  if (clientTsTypes.length > 0) {
    const clientImports = source.find(j.ImportDeclaration, {
      source: { value: v3ClientPackageName },
    });
    for (const clientTsType of clientTsTypes.sort()) {
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
