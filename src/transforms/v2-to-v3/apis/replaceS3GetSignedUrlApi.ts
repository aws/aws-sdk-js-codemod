import { Collection, JSCodeshift, Literal } from "jscodeshift";

import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { getClientIdentifiers } from "./getClientIdentifiers";
import { getCommandName } from "./getCommandName";

export interface ReplaceS3GetSignedUrlApiOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

// Updates `s3.getSignedUrl()` API with `await getSignedUrl(s3, command)` API.
export const replaceS3GetSignedUrlApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceS3GetSignedUrlApiOptions
): void => {
  if (options.v2ClientName !== "S3") return;

  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    source
      .find(j.CallExpression, getClientApiCallExpression(clientId, "getSignedUrl"))
      .replaceWith((callExpression) => {
        const args = callExpression.node.arguments;

        const apiName = (args[0] as Literal).value as string;
        const params = args[1];

        return j.awaitExpression.from({
          argument: j.callExpression.from({
            callee: j.identifier("getSignedUrl"),
            arguments: [clientId, j.newExpression(j.identifier(getCommandName(apiName)), [params])],
          }),
        });
      });
  }
};
