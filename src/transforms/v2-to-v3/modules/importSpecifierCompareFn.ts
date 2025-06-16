import type {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from "jscodeshift";

export const importSpecifierCompareFn = (
  specifier1: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier,
  specifier2: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
) => {
  if (specifier1.type === "ImportSpecifier" && specifier2.type === "ImportSpecifier") {
    const specifier1ImportedName = specifier1.imported.name;
    const specifier2ImportedName = specifier2.imported.name;
    if (typeof specifier1ImportedName !== "string" || typeof specifier2ImportedName !== "string") {
      throw new Error("Please report your use case on https://github.com/aws/aws-sdk-js-codemod");
    }
    return specifier1ImportedName.localeCompare(specifier2ImportedName);
  }

  if (
    specifier1.type === "ImportDefaultSpecifier" &&
    specifier2.type === "ImportDefaultSpecifier"
  ) {
    if (!specifier1.local || !specifier2.local) {
      return 0;
    }
    const specifier1LocalName = specifier1.local.name;
    const specifier2LocalName = specifier2.local.name;
    if (typeof specifier1LocalName !== "string" || typeof specifier2LocalName !== "string") {
      throw new Error("Please report your use case on https://github.com/aws/aws-sdk-js-codemod");
    }
    return specifier1LocalName.localeCompare(specifier2LocalName);
  }

  if (
    specifier1.type === "ImportNamespaceSpecifier" &&
    specifier2.type === "ImportNamespaceSpecifier"
  ) {
    if (!specifier1.local || !specifier2.local) {
      return 0;
    }
    const specifier1LocalName = specifier1.local.name;
    const specifier2LocalName = specifier2.local.name;
    if (typeof specifier1LocalName !== "string" || typeof specifier2LocalName !== "string") {
      throw new Error("Please report your use case on https://github.com/aws/aws-sdk-js-codemod");
    }
    return specifier1LocalName.localeCompare(specifier2LocalName);
  }

  return 0;
};
