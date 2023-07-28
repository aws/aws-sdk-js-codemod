import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { getClientIdentifiers } from "./getClientIdentifiers";

export interface ReplaceS3UploadApiOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

// Updates `s3.upload()` API with `new Upload()` API.
export const replaceS3UploadApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceS3UploadApiOptions
): void => {
  if (options.v2ClientName !== "S3") return;

  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    source
      .find(j.CallExpression, getClientApiCallExpression(clientId, "upload"))
      .replaceWith((callExpression) => {
        const params = callExpression.node.arguments[0];

        const properties = [];
        properties.push(
          j.objectProperty.from({
            key: j.identifier("client"),
            value: clientId,
            shorthand: true,
          })
        );

        if (params) {
          properties.push(
            j.objectProperty.from({
              key: j.identifier("params"),
              // @ts-expect-error Type 'SpreadElement | ExpressionKind' is not assignable
              value: params,
              shorthand: true,
            })
          );
        }

        const options = callExpression.node.arguments[1];
        if (options) {
          switch (options.type) {
            case "ObjectExpression":
              properties.push(...options.properties);
              break;
            case "Identifier":
              properties.push(j.spreadElement(options));
              break;
          }
        }

        return j.newExpression(j.identifier("Upload"), [j.objectExpression(properties)]);
      });

    // Replace `.promise()` call with `.done()` if present.
    source
      .find(j.MemberExpression, {
        type: "MemberExpression",
        object: {
          type: "NewExpression",
          callee: { type: "Identifier", name: "Upload" },
        },
        property: { type: "Identifier", name: "promise" },
      })
      .forEach((memberExpression) => {
        (memberExpression.value.property as Identifier).name = "done";
      });
  }
};
