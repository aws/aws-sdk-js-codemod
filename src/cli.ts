#!/usr/bin/env node

import { spawn } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line
import { AwsSdkJsCodemodTransform } from "./transforms/types";

const transforms = readdirSync(join(__dirname, "transforms"), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .map((dirName) => {
    const { name, description, options } = require(`./transforms/${dirName}/transform`); // eslint-disable-line
    return { name, description, options } as AwsSdkJsCodemodTransform;
  });

const helpParagraph = `aws-sdk-js-codemod is a light wrapper over jscodeshift.
It processes --help, --version and --transform options before passing them downstream.`;

export const run = async (args): Promise<void> => {
  if (args[0] === "--version") {
    process.stdout.write(`aws-sdk-js-codemod: ${version}\n\n`);
  } else if (args[0] === "--help" || args[0] === "-h") {
    process.stdout.write(helpParagraph);
    process.stdout.write(`You can pass names of aws-sdk-js-codemod custom transforms:\n`);
  }
  spawn("npm", ["exec", "jscodeshift", "--", ...args], {
    stdio: "inherit",
    shell: process.platform == "win32",
  });
};

const [, , ...args] = process.argv;

run(args);
