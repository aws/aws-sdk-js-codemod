#!/usr/bin/env node

import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line
import {
  getArgsWithUpdatedTransformFile,
  getHelpParagraph,
  getTransformFileFromArgs,
  getTransforms,
  getUpdatedTransformFile,
} from "./utils";

export const run = async (args: Array<string>): Promise<void> => {
  const transforms = getTransforms();

  if (args[0] === "--version") {
    process.stdout.write(`aws-sdk-js-codemod: ${version}\n\n`);
  } else if (args[0] === "--help" || args[0] === "-h") {
    process.stdout.write(getHelpParagraph(transforms));
  } else if (args.includes("-t") || args.some((arg) => arg.startsWith("--transform="))) {
    const transformFile = getTransformFileFromArgs(args);
    if (transforms.map(({ name }) => name).includes(transformFile)) {
      const updatedTransformFile = getUpdatedTransformFile(transformFile);
      args = getArgsWithUpdatedTransformFile(args, updatedTransformFile);
    }
  }
  spawn("npm", ["exec", "jscodeshift", "--", ...args], {
    stdio: "inherit",
    shell: process.platform == "win32",
  });
};

const [, , ...args] = process.argv;

run(args);
