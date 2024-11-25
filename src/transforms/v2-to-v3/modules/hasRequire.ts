import type { Collection, JSCodeshift } from "jscodeshift";
import { getRequireDeclarators } from "./requireModule/index.ts";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  getRequireDeclarators(j, source).size() > 0;
