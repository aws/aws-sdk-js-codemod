import { Collection, JSCodeshift, TSExternalModuleReference } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath, getV3ClientDefaultLocalName } from "../utils";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientLocalName,
    v2ClientName,
    v2GlobalName,
    v3ClientName,
    v3ClientPackageName,
  }: V3ClientModulesOptions
): void => {
  const v3ClientDefaultLocalName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const existingImportEquals = source.find(j.TSImportEqualsDeclaration, {
    moduleReference: {
      expression: {
        type: "StringLiteral",
        value: v3ClientPackageName,
      },
    },
  });

  if (existingImportEquals.size()) {
    if (
      existingImportEquals
        .nodes()
        .some(
          (importEqualsDeclaration) => importEqualsDeclaration.id.name === v3ClientDefaultLocalName
        )
    ) {
      return;
    }
  }

  // Insert after global, or service import equals.
  source
    .find(j.TSImportEqualsDeclaration, {
      type: "TSImportEqualsDeclaration",
      moduleReference: {
        type: "TSExternalModuleReference",
        expression: { type: "StringLiteral" },
      },
    })
    .filter((importEqualsDeclaration) => {
      const identifierName = importEqualsDeclaration.value.id.name;
      const importEqualsModuleRef = importEqualsDeclaration.value
        .moduleReference as TSExternalModuleReference;
      const expressionValue = importEqualsModuleRef.expression.value;

      if (expressionValue === PACKAGE_NAME && identifierName === v2GlobalName) {
        return true;
      }

      if (
        expressionValue === getV2ServiceModulePath(v2ClientName) &&
        identifierName === v2ClientLocalName
      ) {
        return true;
      }

      return false;
    })
    .at(0)
    .insertAfter(
      j.variableDeclaration("const", [
        j.variableDeclarator(
          j.objectPattern([
            j.objectProperty.from({
              key: j.identifier(v3ClientName),
              value: j.identifier(v2ClientLocalName),
              shorthand: true,
            }),
          ]),
          j.identifier(v3ClientDefaultLocalName)
        ),
      ])
    )
    .insertAfter(
      j.tsImportEqualsDeclaration(
        j.identifier(v3ClientDefaultLocalName),
        j.tsExternalModuleReference(j.stringLiteral(v3ClientPackageName))
      )
    );
};
