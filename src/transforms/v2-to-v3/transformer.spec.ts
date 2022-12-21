import { readdirSync, readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Could not find a declaration file for module 'jscodeshift/dist/testUtils'
import { runInlineTest } from "jscodeshift/dist/testUtils";
import { join } from "path";

import transformer from "./transformer";

const inputFileRegex = /(.*).input.[jt]sx?$/;

describe("v2-to-v3", () => {
  const fixtureDir = join(__dirname, "__fixtures__");
  const testFiles: [string, string][] = readdirSync(fixtureDir)
    .filter((fileName) => inputFileRegex.test(fileName))
    .map((fileName) => [
      (fileName.match(inputFileRegex) as RegExpMatchArray)[1],
      fileName.split(".").pop() as string,
    ]);

  it.each([["api-promise-class-member", "js"]])(
    `transforms correctly using "%s" data`,
    (filePrefix, fileExtension) => {
      const inputPath = join(fixtureDir, [filePrefix, "input", fileExtension].join("."));
      const outputPath = join(fixtureDir, [filePrefix, "output", fileExtension].join("."));
      const inputCode = readFileSync(inputPath, "utf8");
      const outputCode = readFileSync(outputPath, "utf8");

      const input = { path: inputPath, source: inputCode };
      runInlineTest(transformer, null, input, outputCode);
    }
  );
});
