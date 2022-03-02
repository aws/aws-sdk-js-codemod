#!/usr/bin/env node

import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line

const transforms = ["v2-to-v3"].map((folderPath) => {
  const { name, desc, options } = require(`./${folderPath}`); // eslint-disable-line
  return { name, desc, options };
});

export const run = async (args): Promise<void> => {
  if (args[0] === "--version") {
    process.stdout.write(`aws-sdk-js-codemod: ${version}\n\n`);
  } else if (args[0] === "--help" || args[0] === "-h") {
    process.stdout.write(`aws-sdk-js-codemod is a light wrapper over jscodeshift.\n`);
    process.stdout.write(`aws-sdk-js-codemod is a light wrapper over jscodeshift.\n`);
  }
  spawn("npm", ["exec", "jscodeshift", "--", ...args], {
    stdio: "inherit",
    shell: process.platform == "win32",
  });
};

const [, , ...args] = process.argv;

run(args);
