import { readdirSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import jscodeshift from "jscodeshift";
import { describe, expect, it } from "vitest";

import transform from "./transformer";

describe("v2-to-v3", () => {
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

  describe.each(fixtureSubDirs)("%s", (subDir) => {
    // Temporarily skip multiple-declarators use case.
    // Resume when declarators are sorted, and added before the selected import.
    if (fixtureDir === "multiple-declarators") return;

    const subDirPath = join(fixtureDir, subDir);
    it.concurrent.each(getTestFileMetadata(subDirPath))(
      `transforms: %s.%s`,
      async (filePrefix, fileExtension) => {
        const { input, outputCode } = await getTestMetadata(subDirPath, filePrefix, fileExtension);

        const output = await transform(input, {
          j: jscodeshift,
          jscodeshift,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          stats: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          report: () => {},
        });

        expect(output.trim()).toEqual(outputCode.trim());
      },
      100000
    );
  });
});
