import { readdirSync, readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Could not find a declaration file for module 'jscodeshift/dist/testUtils'
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

describe("v2-to-v3", () => {
  const fixtureDir = join(__dirname, "__fixtures__");
  const testFilePrefixes = readdirSync(fixtureDir)
    .filter((fileName) => fileName.endsWith(".input.ts"))
    .map((fileName) => fileName.replace(".input.ts", ""));

  it.each(testFilePrefixes)(`transforms correctly using "%s" data`, (testFilePrefix) => {
    const inputPath = join(fixtureDir, testFilePrefix + `.input.ts`);
    const outputPath = join(fixtureDir, testFilePrefix + `.output.ts`);
    const inputCode = readFileSync(inputPath, "utf8");
    const outputCode = readFileSync(outputPath, "utf8");
    const input = { path: inputPath, source: inputCode };

    runInlineTest(transformer, null, input, outputCode);
  });
});
