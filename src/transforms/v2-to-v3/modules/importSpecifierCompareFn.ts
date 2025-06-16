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
    const specifier1ImportedName = specifier1.imported.name as string;
    const specifier2ImportedName = specifier2.imported.name as string;
    return specifier1ImportedName.localeCompare(specifier2ImportedName);
  }

  const specifier1LocalName = specifier1.local?.name as string;
  const specifier2LocalName = specifier2.local?.name as string;

  if (
    specifier1.type === "ImportDefaultSpecifier" &&
    specifier2.type === "ImportDefaultSpecifier"
  ) {
    if (specifier1.local && specifier2.local)
      return specifier1LocalName.localeCompare(specifier2LocalName);
    return 0;
  }

  if (
    specifier1.type === "ImportNamespaceSpecifier" &&
    specifier2.type === "ImportNamespaceSpecifier"
  ) {
    if (specifier1.local && specifier2.local)
      return specifier1LocalName.localeCompare(specifier2LocalName);
    return 0;
  }

  return 0;
};
