export const name = "v2-to-v3";

export const description =
  "Converts AWS SDK for JavaScript APIs in a Javascript/TypeScript codebase" +
  " from version 2 (v2) to version 3 (v3).";

// Additional options will come here, like running on specific clients.
export const options = [
  {
    type: "string" as const,
    description: "Comma-separated list of AWS SDK client names to transform (e.g., 's3,dynamodb'). If not specified, all clients will be transformed.",
  },
];
