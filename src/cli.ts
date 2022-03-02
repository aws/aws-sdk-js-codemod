#!/usr/bin/env node
import { spawn } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line

yargs(hideBin(process.argv)).commandDir("transforms").argv;

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
