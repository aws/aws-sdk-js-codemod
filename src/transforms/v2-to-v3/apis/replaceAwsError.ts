import { Collection, JSCodeshift } from "jscodeshift";
import { ImportType } from "../modules";

export interface ReplaceAwsErrorOptions {
  v2GlobalName?: string;
  importType: ImportType;
}

export const replaceAwsError = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, importType }: ReplaceAwsErrorOptions
) => {};
