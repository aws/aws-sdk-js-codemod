import { AwsSdkJsCodemodTransform } from "../types";

const name = "v2-to-v3";

const description =
  "Converts AWS SDK for JavaScript APIs in a Javascript/TypeScript codebase" +
  " from version 2 (v2) to version 3 (v3).";

// Additional options will come here, like running on specific clients.
const options = [];

export default { name, description, options } as AwsSdkJsCodemodTransform;
