import { readdirSync } from "fs";
import { readFile } from "fs/promises";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Could not find a declaration file for module 'jscodeshift/dist/testUtils'
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

describe("v2-to-v3", () => {
  jest.setTimeout(20000);

  const inputFileRegex = /(.*).input.[jt]sx?$/;
  const fixtureDir = join(__dirname, "__fixtures__");
  const testFiles: [string, string][] = readdirSync(fixtureDir)
    .filter((fileName) => inputFileRegex.test(fileName))
    .map((fileName) => [
      (fileName.match(inputFileRegex) as RegExpMatchArray)[1],
      fileName.split(".").pop() as string,
    ]);

  it.concurrent.each(testFiles)(`transforms: %s.%s`, async (filePrefix, fileExtension) => {
    const inputPath = join(fixtureDir, [filePrefix, "input", fileExtension].join("."));
    const outputPath = join(fixtureDir, [filePrefix, "output", fileExtension].join("."));
    const inputCode = await readFile(inputPath, "utf8");
    const outputCode = await readFile(outputPath, "utf8");

    const input = { path: inputPath, source: inputCode };
    runInlineTest(transformer, null, input, outputCode);
  });
});
