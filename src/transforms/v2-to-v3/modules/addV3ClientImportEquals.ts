import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { getV2ImportEqualsDeclaration } from "./getV2ImportEqualsDeclaration";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  const { v2ClientLocalName, v2ClientName, v2GlobalName, v3ClientName, v3ClientPackageName } =
    options;

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
  const v2ImportEqualsDeclaration = getV2ImportEqualsDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
  }).at(0);

  if (
    getNewExpressionCount(j, source, options) > 0 ||
    getClientTSTypeRefCount(j, source, options) > 0
  ) {
    v2ImportEqualsDeclaration.insertAfter(
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
    );
  }

  v2ImportEqualsDeclaration.insertAfter(
    j.tsImportEqualsDeclaration(
      j.identifier(v3ClientDefaultLocalName),
      j.tsExternalModuleReference(j.stringLiteral(v3ClientPackageName))
    )
  );
};
