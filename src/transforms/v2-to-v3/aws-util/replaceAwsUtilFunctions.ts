import { Collection, JSCodeshift } from "jscodeshift";
import { replaceAwsUtilArrayFunctions } from "./replaceAwsUtilArrayFunctions";
import { replaceAwsUtilCopy } from "./replaceAwsUtilCopy";

export const replaceAwsUtilFunctions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName?: string
) => {
  if (!v2GlobalName) return;

  replaceAwsUtilArrayFunctions(j, source, v2GlobalName);
  replaceAwsUtilCopy(j, source, v2GlobalName);
};
