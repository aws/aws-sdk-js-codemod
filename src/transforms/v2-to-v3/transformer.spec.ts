import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import jscodeshift from "jscodeshift";
import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

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
          ] as const,
      );

  const getTestMetadata = async (
    dirPath: string,
    filePrefix: string,
    fileExtension: string,
  ) => {
    const inputPath = join(
      dirPath,
      [filePrefix, "input", fileExtension].join("."),
    );
    const outputPath = join(
      dirPath,
      [filePrefix, "output", fileExtension].join("."),
    );
    const inputCode = await readFile(inputPath, "utf8");
    const outputCode = await readFile(outputPath, "utf8");

    const input = { path: inputPath, source: inputCode };
    return { input, outputCode };
  };

  for (const subDir of fixtureSubDirs) {
    describe(subDir, () => {
      const subDirPath = join(fixtureDir, subDir);
      for (const [filePrefix, fileExtension] of getTestFileMetadata(
        subDirPath,
      )) {
        it(
          `transforms: ${filePrefix}.${fileExtension}`,
          { concurrency: true },
          async () => {
            const { input, outputCode } = await getTestMetadata(
              subDirPath,
              filePrefix,
              fileExtension,
            );

            const output = await transform(input, {
              j: jscodeshift,
              jscodeshift,
              // biome-ignore lint/suspicious/noEmptyBlockStatements: test helper
              stats: () => {},
              // biome-ignore lint/suspicious/noEmptyBlockStatements: test helper
              report: () => {},
            });

            strictEqual(output.trim(), outputCode.trim());
          },
        );
      }
    });
  }
});
