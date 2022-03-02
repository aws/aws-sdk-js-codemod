import { Arguments, Argv } from "yargs";

export const command = "v2-to-v3";

export const desc =
  "Converts AWS SDK for JavaScript APIs in a Javascript/TypeScript codebase" +
  " from version 2 (v2) to version 3 (v3).";

// Additional options will come here, like running on specific clients.
export const builder = (yargs: Argv<any>): Argv<any> => yargs.options({});

export const handler = (args: Arguments<any>): void => {
  console.log(`yargs is used only for tracking transform name, description and options.`);
  console.log(`Please pass this transform '${command}' to aws-sdk-js-codemod directly.`);
};
