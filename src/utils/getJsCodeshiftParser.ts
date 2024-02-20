// Most of the code from here is from bin/jscodeshift.js
// It's kept that way so that users can reuse jscodeshift options.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import argsParser from "jscodeshift/dist/argsParser";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../../package.json";

const requirePackage = (name: string) => {
  const entry = require.resolve(name);
  let dir = dirname(entry);
  while (dir !== "/") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pkg = require(join(dir, "package.json"));
      return pkg.name === name ? pkg : {};
    } catch (error) {} // eslint-disable-line no-empty
    dir = dirname(dir);
  }
  return {};
};

/* eslint-disable @typescript-eslint/naming-convention */
export const getJsCodeshiftParser = () =>
  argsParser.options({
    transform: {
      display_index: 15,
      abbr: "t",
      default: "./transform.js",
      help: "path to the transform file. Can be either a local path or url",
      metavar: "FILE",
      required: true,
    },
    cpus: {
      display_index: 1,
      abbr: "c",
      help: "start at most N child processes to process source files",
      defaultHelp: "max(all - 1, 1)",
      metavar: "N",
      process: Number,
    },
    verbose: {
      display_index: 16,
      abbr: "v",
      choices: [0, 1, 2],
      default: 0,
      help: "show more information about the transform process",
      metavar: "N",
      process: Number,
    },
    dry: {
      display_index: 2,
      abbr: "d",
      flag: true,
      default: false,
      help: "dry run (no changes are made to files)",
    },
    print: {
      display_index: 11,
      abbr: "p",
      flag: true,
      default: false,
      help: "print transformed files to stdout, useful for development",
    },
    babel: {
      display_index: 0,
      flag: true,
      default: false,
      help: "apply babeljs to the transform file",
    },
    extensions: {
      display_index: 3,
      // Explicitly add all extensions as default to avoid bug in jscodeshift.
      // Refs: https://github.com/facebook/jscodeshift/issues/582
      // Source code: https://github.com/facebook/jscodeshift/blob/51da1a5c4ba3707adb84416663634d4fc3141cbb/src/Worker.js#L80
      default: [
        ...DEFAULT_EXTENSIONS.map((ext) => (ext.startsWith(".") ? ext.substring(1) : ext)),
        "ts",
        "tsx",
      ].join(","),
      help: "transform files with these file extensions (comma separated list)",
      metavar: "EXT",
    },
    ignorePattern: {
      display_index: 7,
      full: "ignore-pattern",
      list: true,
      help: "ignore files that match a provided glob expression",
      metavar: "GLOB",
    },
    ignoreConfig: {
      display_index: 6,
      full: "ignore-config",
      list: true,
      help: "ignore files if they match patterns sourced from a configuration file (e.g. a .gitignore)",
      metavar: "FILE",
    },
    gitignore: {
      display_index: 8,
      flag: true,
      default: false,
      help: "adds entries the current directory's .gitignore file",
    },
    runInBand: {
      display_index: 12,
      flag: true,
      default: false,
      full: "run-in-band",
      help: "run serially in the current process",
    },
    silent: {
      display_index: 13,
      abbr: "s",
      flag: true,
      default: false,
      help: "do not write to stdout or stderr",
    },
    parser: {
      display_index: 9,
      choices: ["babel", "babylon", "flow", "ts", "tsx"],
      default: "babel",
      help: "the parser to use for parsing the source files",
    },
    parserConfig: {
      display_index: 10,
      full: "parser-config",
      help: "path to a JSON file containing a custom parser configuration for flow or babylon",
      metavar: "FILE",
      process: (file: string) => JSON.parse(readFileSync(file).toString()),
    },
    failOnError: {
      display_index: 4,
      flag: true,
      help: "Return a non-zero code when there are errors",
      full: "fail-on-error",
      default: false,
    },
    version: {
      display_index: 17,
      help: "print version and exit",
      callback: function () {
        return [
          `aws-sdk-js-codemod: ${version}`,
          `- jscodeshift: ${requirePackage("jscodeshift").version}`,
          `- recast: ${requirePackage("recast").version}\n`,
        ].join("\n");
      },
    },
    stdin: {
      display_index: 14,
      help: "read file/directory list from stdin",
      flag: true,
      default: false,
    },
  });
