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
  const fixtureSubDirs = readdirSync(fixtureDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const getTestFileMetadata = (dirPath: string) =>
    readdirSync(dirPath)
      .filter((fileName) => inputFileRegex.test(fileName))
      .map(
        (fileName) =>
          [
            (fileName.match(inputFileRegex) as RegExpMatchArray)[1],
            fileName.split(".").pop() as string,
          ] as const
      );

  const getTestMetadata = async (dirPath: string, filePrefix: string, fileExtension: string) => {
    const inputPath = join(dirPath, [filePrefix, "input", fileExtension].join("."));
    const outputPath = join(dirPath, [filePrefix, "output", fileExtension].join("."));
    const inputCode = await readFile(inputPath, "utf8");
    const outputCode = await readFile(outputPath, "utf8");

    const input = { path: inputPath, source: inputCode };
    return { input, outputCode };
  };

  describe.each(["new-client"])("%s", (subDir) => {
    const subDirPath = join(fixtureDir, subDir);
    it.concurrent.each([["global-require", "js"]])(
      `transforms: %s.%s`,
      async (filePrefix, fileExtension) => {
        const { input, outputCode } = await getTestMetadata(subDirPath, filePrefix, fileExtension);
        runInlineTest(transformer, null, input, outputCode);
      }
    );
  });
});
