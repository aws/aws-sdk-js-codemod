import { readdirSync, readFileSync } from "fs";
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

describe("v2-to-v3", () => {
  const fixtureDir = join(__dirname, "__fixtures__");
  const testFilePrefixes = readdirSync(fixtureDir)
    .filter((fileName) => fileName.endsWith(".input.ts"))
    .map((fileName) => fileName.replace(".input.ts", ""));

  describe.each(testFilePrefixes)(`transforms correctly using "%s" data`, (testFilePrefix) => {
    it.each([{}, { parser: "ts" }])("with testOptions: %o", (testOptions) => {
      const path = join(fixtureDir, testFilePrefix + `.input.ts`);
      const source = readFileSync(path, "utf8");
      const input = { path, source };
      const expectedOutput = readFileSync(join(fixtureDir, testFilePrefix + `.output.ts`), "utf8");
      runInlineTest(transformer, null, input, expectedOutput, testOptions);
    });
  });
});
