import { Collection, JSCodeshift } from "jscodeshift";

import { getClientIdentifiers } from "./getClientIdentifiers";

export interface IsS3UploadApiUsedOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const isS3UploadApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: IsS3UploadApiUsedOptions
) => {
  if (options.v2ClientName !== "S3") return false;

  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    const s3UploadCallExpressions = source.find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: clientId,
        property: { type: "Identifier", name: "upload" },
      },
    });

    if (s3UploadCallExpressions.length) return true;
  }

  return false;
};
