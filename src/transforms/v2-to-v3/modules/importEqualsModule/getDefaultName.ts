export const getDefaultName = (packageName: string) =>
  ["AWS", ...packageName.split("/").pop()!.split("-")].join("_");
