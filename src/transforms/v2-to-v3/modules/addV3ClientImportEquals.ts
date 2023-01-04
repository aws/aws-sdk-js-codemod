import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getV2ImportEqualsDeclaration } from "./getV2ImportEqualsDeclaration";
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
  const existingImportEquals = source.find(
    j.TSImportEqualsDeclaration,
    getImportEqualsDeclaration(v3ClientPackageName)
  );

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
  getV2ImportEqualsDeclaration(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName })
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
