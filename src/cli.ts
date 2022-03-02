#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../package.json";

const [, , ...args] = process.argv;

if (args[0] === "--version") {
  console.log(`v${version}`);
}
