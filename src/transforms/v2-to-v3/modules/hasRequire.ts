import type { Collection, JSCodeshift } from "jscodeshift";
import { getRequireDeclarators } from "./requireModule";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  getRequireDeclarators(j, source).size() > 0;
