import { resolve } from "node:path";

export const getUpdatedTransformFile = (transformFolder: string) =>
  resolve(__dirname, "..", "transforms", transformFolder, "transformer.js");
