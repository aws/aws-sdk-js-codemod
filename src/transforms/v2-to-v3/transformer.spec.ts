import { readdirSync, readFileSync } from "fs";
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

describe("v2-to-v3", () => {
  const testFilePrefixes = readdirSync(join(__dirname, "__testfixtures__"))
    .filter((fileName) => fileName.endsWith(".input.ts"))
    .map((fileName) => fileName.replace(".input.ts", ""));

  it.each(testFilePrefixes)("%s", async (testFilePrefix) => {
    const fixtureDir = join(__dirname, "__testfixtures__");
    const inputPath = join(fixtureDir, testFilePrefix + `.input.ts`);
    const source = readFileSync(inputPath, "utf8");
    const expectedOutput = readFileSync(join(fixtureDir, testFilePrefix + `.output.ts`), "utf8");
    runInlineTest(
      transformer,
      null,
      {
        path: inputPath,
        source,
      },
      expectedOutput
    );
  });
});
