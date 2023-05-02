import { getTransformDescription } from "./getTransformDescription";
import { AwsSdkJsCodemodTransform } from "../transforms";

const separator = "-".repeat(95);

export const getHelpParagraph = (transforms: AwsSdkJsCodemodTransform[]) =>
  `${separator}
aws-sdk-js-codemod is a lightweight wrapper over jscodeshift.
It processes --help, --version and --transform options before passing them downstream.

You can provide names of the custom transforms instead of a local path or url:

${transforms.map((transform) => getTransformDescription(transform).join("\n"))}

Example: aws-sdk-js-codemod -t v2-to-v3 example.js

To use the latest version of aws-sdk-js-codemod, please clear your npx cache and re-run.

${separator}\n\n`;
