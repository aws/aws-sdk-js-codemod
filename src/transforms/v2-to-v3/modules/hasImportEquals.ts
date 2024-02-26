import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getImportEqualsDeclarationType } from "./getImportEqualsDeclarationType";

export const hasImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.TSImportEqualsDeclaration, getImportEqualsDeclarationType())
    .filter((importEqualsDeclaration) => {
      const { moduleReference } = importEqualsDeclaration.value;
      if (moduleReference.type !== "TSExternalModuleReference") return false;
      const { expression } = moduleReference;
      return (
        expression.type === "StringLiteral" &&
        typeof expression.value === "string" &&
        expression.value.startsWith(PACKAGE_NAME)
      );
    })
    .size() > 0;
