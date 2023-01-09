import { Collection, JSCodeshift } from "jscodeshift";

import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";

export const hasImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.TSImportEqualsDeclaration, getImportEqualsDeclaration())
    .filter((importEqualsDeclaration) => {
      const { moduleReference } = importEqualsDeclaration.value;
      if (moduleReference.type !== "TSExternalModuleReference") return false;
      const { expression } = moduleReference;
      return (
        expression.type === "StringLiteral" &&
        typeof expression.value === "string" &&
        expression.value.startsWith("aws-sdk")
      );
    })
    .size() > 0;
