import { Collection, JSCodeshift } from "jscodeshift";

import { ClientModulesOptions, ImportSpecifierOptions } from "../types";
import { addClientDefaultModule } from "./addClientDefaultModule";

/**
 * Import Equals does not support named import.
 * We just add a default import for the package.
 */
export const addClientNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & ImportSpecifierOptions
) => {
  addClientDefaultModule(j, source, options);
};
