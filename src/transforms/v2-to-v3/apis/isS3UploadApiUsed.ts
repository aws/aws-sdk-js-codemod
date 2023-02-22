import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";

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

  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);

  for (const v2ClientId of v2ClientIdentifiers) {
    const s3UploadCallExpressions = source.find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: v2ClientId,
        property: { type: "Identifier", name: "upload" },
      },
    });

    if (s3UploadCallExpressions.length) return true;
  }

  return false;
};