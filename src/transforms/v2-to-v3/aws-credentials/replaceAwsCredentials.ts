import { Collection, JSCodeshift } from "jscodeshift";
import { replaceEnvCredentials } from "./replaceEnvCredentials";

export const replaceAwsCredentials = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  replaceEnvCredentials(j, source, v2GlobalName);
};
