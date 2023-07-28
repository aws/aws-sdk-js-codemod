import {
  Collection,
  JSCodeshift,
  Literal,
  NewExpression,
  ObjectExpression,
  Property,
  ObjectProperty,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { ClientIdentifier, getClientIdentifiers } from "./getClientIdentifiers";
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

        const options = j.objectExpression([]);
        if (params.type === "ObjectExpression") {
          // Check if params has property 'Expires' and add it to options.
          for (const property of params.properties) {
            if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) continue;
            const propertyKey = (property as Property | ObjectProperty).key;
            const propertyValue = (property as Property | ObjectProperty).value;
            if (propertyKey.type === "Identifier") {
              const propertyKeyName = propertyKey.name;
              if (propertyKeyName === "Expires") {
                // Add 'expiresIn' property to options.
                options.properties.push(
                  j.objectProperty.from({
                    key: j.identifier("expiresIn"),
                    value: propertyValue,
                    shorthand: true,
                  })
                );
                // Remove 'Expires' property from params.
                params.properties = params.properties.filter((property) => {
                  if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return true;
                  const propertyKey = (property as Property | ObjectProperty).key;
                  if (propertyKey.type !== "Identifier") return true;
                  return propertyKey.name !== "Expires";
                });
              }
            }
          }
        }

        const getSignedUrlArgs: (ClientIdentifier | NewExpression | ObjectExpression)[] = [
          clientId,
          j.newExpression(j.identifier(getCommandName(apiName)), [params]),
        ];

        if (options.properties.length > 0) {
          getSignedUrlArgs.push(options);
        }

        return j.awaitExpression.from({
          argument: j.callExpression.from({
            callee: j.identifier("getSignedUrl"),
            arguments: getSignedUrlArgs,
          }),
        });
      });
  }
};
