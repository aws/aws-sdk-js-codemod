import { resolve } from "path";

export const getUpdatedTransformFile = (transformFolder: string) =>
  resolve(__dirname, "..", "transforms", transformFolder, "transformer.js");
