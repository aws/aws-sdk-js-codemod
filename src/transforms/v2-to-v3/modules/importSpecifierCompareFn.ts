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
    return specifier1.imported.name.localeCompare(specifier2.imported.name);
  }

  if (
    specifier1.type === "ImportDefaultSpecifier" &&
    specifier2.type === "ImportDefaultSpecifier"
  ) {
    if (specifier1.local && specifier2.local)
      return specifier1.local.name.localeCompare(specifier2.local.name);
    return 0;
  }

  if (
    specifier1.type === "ImportNamespaceSpecifier" &&
    specifier2.type === "ImportNamespaceSpecifier"
  ) {
    if (specifier1.local && specifier2.local)
      return specifier1.local.name.localeCompare(specifier2.local.name);
    return 0;
  }

  return 0;
};
