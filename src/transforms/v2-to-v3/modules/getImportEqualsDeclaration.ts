import { Collection, JSCodeshift, TSExternalModuleReference } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getClientDeepImportPath } from "../utils";

import { getImportEqualsDeclarationType } from "./getImportEqualsDeclarationType";

export interface GetImportEqualsDeclarationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getImportEqualsDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetImportEqualsDeclarationOptions
) =>
  // Return global or service import declaration.
  source
    .find(j.TSImportEqualsDeclaration, getImportEqualsDeclarationType())
    .filter((importEqualsDeclaration) => {
      const identifierName = importEqualsDeclaration.value.id.name;
      const importEqualsModuleRef = importEqualsDeclaration.value
        .moduleReference as TSExternalModuleReference;
      const expressionValue = importEqualsModuleRef.expression.value;

      if (expressionValue === PACKAGE_NAME && identifierName === v2GlobalName) {
        return true;
      }

      if (
        expressionValue === getClientDeepImportPath(v2ClientName) &&
        identifierName === v2ClientLocalName
      ) {
        return true;
      }

      return false;
    });
