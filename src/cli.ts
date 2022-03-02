#!/usr/bin/env node

import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line

const [, , ...args] = process.argv;
const jscodeshiftPath = "./node_modules/.bin/jscodeshift";

if (args[0] === "--version") {
  process.stdout.write(`aws-sdk-js-codemod: ${version}\n\n`);
  spawn(jscodeshiftPath, ["--version"], { stdio: "inherit" });
} else {
  spawn(jscodeshiftPath, args, { stdio: "inherit" });
}
