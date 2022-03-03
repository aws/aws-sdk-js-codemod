// @ts-expects-error Could not find a declaration file for module
import { defineTest } from "jscodeshift/dist/testUtils";

defineTest(__dirname, "./transformer", null, "basic", { parser: "ts" });
