import { TSImportEqualsDeclaration } from "jscodeshift";

export const getImportEqualsDeclaration = (expressionValue?: string) =>
  ({
    type: "TSImportEqualsDeclaration",
    moduleReference: {
      type: "TSExternalModuleReference",
      expression: { type: "StringLiteral", ...(expressionValue && { value: expressionValue }) },
    },
  } as TSImportEqualsDeclaration);
