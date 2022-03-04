// @ts-expects-error Could not find a declaration file for module
import { defineTest } from "jscodeshift/dist/testUtils";

describe("v2-to-v3", () => {
  defineTest(__dirname, "./transformer", null, "basic", { parser: "ts" });
});
