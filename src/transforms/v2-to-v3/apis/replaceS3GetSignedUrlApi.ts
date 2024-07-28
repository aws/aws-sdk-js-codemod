import type {
  Collection,
  JSCodeshift,
  NewExpression,
  ObjectExpression,
  ObjectProperty,
  Property,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
import type { ClientIdentifier } from "../types";
import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { getCommandName } from "./getCommandName";

// Updates `s3.getSignedUrl()` API with `await getSignedUrl(s3, command)` API.
export const replaceS3GetSignedUrlApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    for (const getSignedUrlApiName of ["getSignedUrl", "getSignedUrlPromise"]) {
      source
        .find(j.CallExpression, getClientApiCallExpression(clientId, getSignedUrlApiName))
        .replaceWith((callExpression) => {
          const args = callExpression.node.arguments;

          if (args[0].type !== "Literal" && args[0].type !== "StringLiteral") {
            return callExpression;
          }

          if (typeof args[0].value !== "string") {
            return callExpression;
          }

          const apiName = args[0].value;
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
          } else {
            // Add comment that expiredIn need to explicitly set.
            options.properties.push(
              j.objectProperty.from({
                key: j.identifier("expiresIn"),
                value: j.literal.from({
                  value: "/* add value from 'Expires' from v2 call if present, else remove */",
                }),
                shorthand: true,
              })
            );
          }

          const getSignedUrlArgs: (ClientIdentifier | NewExpression | ObjectExpression)[] = [
            clientId,
            j.newExpression(j.identifier(getCommandName(apiName)), [params]),
          ];

          if (options.properties.length > 0) {
            getSignedUrlArgs.push(options);
          }

          const outputCallExpression = j.callExpression.from({
            callee: j.identifier("getSignedUrl"),
            arguments: getSignedUrlArgs,
          });

          return getSignedUrlApiName.endsWith("Promise")
            ? outputCallExpression
            : j.awaitExpression.from({
                argument: outputCallExpression,
              });
        });
    }
  }
};
