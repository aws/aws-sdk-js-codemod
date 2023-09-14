import { readFileSync } from "fs";
import { join } from "path";
import { JSCodeshift } from "jscodeshift";
import { DOCUMENT_CLIENT } from "../../src/transforms/v2-to-v3/config";

export const getTypesSource = (j: JSCodeshift, clientName: string) => {
  const typesPath =
    clientName === DOCUMENT_CLIENT
      ? join("node_modules", "aws-sdk", "lib", "dynamodb", `document_client.d.ts`)
      : join("node_modules", "aws-sdk", "clients", `${clientName.toLowerCase()}.d.ts`);
  const relativeTypesPath = join(__dirname, "..", "..", typesPath);

  const typesCode = readFileSync(relativeTypesPath, "utf8");

  return j(typesCode);
};
