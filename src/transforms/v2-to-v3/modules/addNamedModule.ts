import { Collection, JSCodeshift } from "jscodeshift";

import * as importEqualsModule from "./importEqualsModule";
import * as importModule from "./importModule";
import * as requireModule from "./requireModule";
import { ImportType, ModulesOptions } from "./types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions & { importType: ImportType }
) => {
  const { importType, ...addNamedModuleOptions } = options;

  const { addNamedModule } =
    importType === ImportType.REQUIRE
      ? requireModule
      : importType === ImportType.IMPORT_EQUALS
        ? importEqualsModule
        : importModule;

  addNamedModule(j, source, addNamedModuleOptions);
};
