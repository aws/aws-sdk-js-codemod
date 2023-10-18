export const getImportEqualsDefaultName = (packageName: string) =>
  ["AWS", ...packageName.split("/").pop()!.split("-")].join("_");
