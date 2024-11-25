import type { Collection, JSCodeshift } from "jscodeshift";

import * as importEqualsModule from "./importEqualsModule/index.ts";
import * as importModule from "./importModule/index.ts";
import * as requireModule from "./requireModule/index.ts";
import { ImportType, type ModulesOptions } from "./types.ts";

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
