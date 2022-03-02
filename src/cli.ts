#!/usr/bin/env node

import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json"; // eslint-disable-line

const [, , ...args] = process.argv;

if (args[0] === "--version") {
  console.log(`v${version}`);
} else {
  spawn("jscodeshift", args, { stdio: "inherit" });
}
