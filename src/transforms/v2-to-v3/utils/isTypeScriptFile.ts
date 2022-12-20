export const isTypeScriptFile = (filePath: string): boolean =>
  filePath.endsWith(".ts") || filePath.endsWith(".tsx");
