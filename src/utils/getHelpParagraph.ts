import type { AwsSdkJsCodemodTransform } from "../transforms";
import { getTransformDescription } from "./getTransformDescription";

const separator = "-".repeat(95);

export const getHelpParagraph = (transforms: AwsSdkJsCodemodTransform[]) =>
  `${separator}
aws-sdk-js-codemod is a lightweight wrapper over jscodeshift.
It processes --help, --version and --transform options before passing them downstream.

You can provide names of the custom transforms instead of a local path or url:

${transforms.map((transform) => getTransformDescription(transform).join("\n"))}

Example: npx aws-sdk-js-codemod@latest -t v2-to-v3 example.js

${separator}\n\n`;
