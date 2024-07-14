#!/usr/bin/env node

/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Most of the code from here is from bin/jscodeshift.js
// It's kept that way so that users can reuse jscodeshift options.

// @ts-nocheck
import path from "node:path";
import Runner from "jscodeshift/dist/Runner";

import {
  getHelpParagraph,
  getJsCodeshiftParser,
  getTransforms,
  getUpdatedTransformFile,
} from "./utils";

const args = process.argv;
const transforms = getTransforms();

if (args[2] === "--help" || args[2] === "-h") {
  process.stdout.write(getHelpParagraph(transforms));
}

const disclaimerLines = [
  `╔════════════════════════════════════════════════════════╗`,
  `║ Please review the code change thoroughly for required  ║`,
  `║ functionality before deploying it to production.       ║`,
  `║                                                        ║`,
  `║ If the transformation is not complete or is incorrect, ║`,
  `║ please report the issue on GitHub.                     ║`,
  `╚════════════════════════════════════════════════════════╝`,
  ``,
];

const parser = getJsCodeshiftParser();

let options: Record;
let positionalArguments: Array;
try {
  ({ options, positionalArguments } = parser.parse());
  if (positionalArguments.length === 0 && !options.stdin) {
    process.stderr.write(
      // biome-ignore lint/style/useTemplate: This is a multiline string
      "Error: You have to provide at least one file/directory to transform." +
        "\n\n---\n\n" +
        parser.getHelpText()
    );
    process.exit(1);
  }
} catch (e) {
  const exitCode = e.exitCode === undefined ? 1 : e.exitCode;
  (exitCode ? process.stderr : process.stdout).write(e.message);
  process.exit(exitCode);
}

const { transform } = options;
if (transforms.map(({ name }) => name).includes(transform)) {
  const supressDisclaimer = process.env.AWS_SDK_JS_CODEMOD_SUPRESS_WARNING;
  if (!supressDisclaimer || !supressDisclaimer === "1") {
    console.warn(disclaimerLines.map((line) => `\n${line}`).join(""));
  }
  options.transform = getUpdatedTransformFile(transform);
}

function run(paths, options) {
  Runner.run(
    /^https?/.test(options.transform) ? options.transform : path.resolve(options.transform),
    paths,
    options
  );
}

if (options.stdin) {
  let buffer = "";
  process.stdin.on("data", (data) => {
    buffer += data;
  });
  process.stdin.on("end", () => run(buffer.split("\n"), options));
} else {
  run(positionalArguments, options);
}
