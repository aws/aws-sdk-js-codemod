export const getDefaultName = (packageName: string) =>
  // biome-ignore lint/style/noNonNullAssertion: This is a valid assertion
  ["AWS", ...packageName.split("/").pop()!.split("-")].join("_");
