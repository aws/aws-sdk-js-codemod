import { readdirSync } from "fs";
import { runTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

describe("v2-to-v3", () => {
  const testFilePrefixes = readdirSync(join(__dirname, "..", "__testfixtures__"))
    .filter((fileName) => fileName.endsWith(".input.ts"))
    .map((fileName) => fileName.replace(".input.ts", ""));

  it.each(testFilePrefixes)("%s", (testFilePrefix) => {
    runTest(__dirname, "./transformer", null, testFilePrefix, { parser: "ts" });
  });
});
