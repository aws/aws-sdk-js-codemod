import { getBorderCharacters, table } from "table";

import { AwsSdkJsCodemodTransform } from "../transforms";

export const getHelpParagraph = (transforms: Array<AwsSdkJsCodemodTransform>) =>
  `----------------------------------------------------------------------------------------------------
aws-sdk-js-codemod is a lightweight wrapper over jscodeshift.
It processes --help, --version and --transform options before passing them downstream.

You can provide names of the custom transforms instead of a local path or url:

${table(
  transforms.map(({ name, description }) => [name, description]),
  {
    border: getBorderCharacters("void"),
    columns: [
      { width: 12, alignment: "right" },
      { width: 88, wrapWord: true },
    ],
  }
)}Example: aws-sdk-js-codemod -t v2-to-v3 example.js

----------------------------------------------------------------------------------------------------\n\n`;
