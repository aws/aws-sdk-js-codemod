import { promises, readdirSync } from "fs";
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

describe("v2-to-v3", () => {
  const fixtureDir = join(__dirname, "__fixtures__");
  const testFilePrefixes = readdirSync(fixtureDir)
    .filter((fileName) => fileName.endsWith(".input.ts"))
    .map((fileName) => fileName.replace(".input.ts", ""));

  describe.each(testFilePrefixes)(`transforms correctly using "%s" data`, (testFilePrefix) => {
    it.each([{}, { parser: "ts" }])("with testOptions: %o", async (testOptions) => {
      const inputPath = join(fixtureDir, testFilePrefix + `.input.ts`);
      const outputPath = join(fixtureDir, testFilePrefix + `.output.ts`);
      const [source, expectedOutput] = await Promise.all([
        promises.readFile(inputPath, "utf8"),
        promises.readFile(outputPath, "utf8"),
      ]);
      const input = { path: inputPath, source };
      runInlineTest(transformer, null, input, expectedOutput, testOptions);
    });
  });
});
