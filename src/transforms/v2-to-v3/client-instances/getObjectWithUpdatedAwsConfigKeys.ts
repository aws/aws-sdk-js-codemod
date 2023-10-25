import { JSCodeshift, ObjectExpression, ObjectProperty, Property } from "jscodeshift";
import { AWS_CONFIG_KEY_MAP, OBJECT_PROPERTY_TYPE_LIST } from "../config";

const getUnsuppportedCommentLine = (keyName: string) =>
  ` The key ${keyName} is no longer supported in v3, and can be removed.`;

export const getObjectWithUpdatedAwsConfigKeys = (
  j: JSCodeshift,
  objectExpression: ObjectExpression
) => {
  objectExpression.properties = objectExpression.properties.map((property) => {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
      return property;
    }

    const propertyKey = (property as Property | ObjectProperty).key;
    if (propertyKey.type !== "Identifier") {
      return property;
    }

    const awsConfigKeyStatus = AWS_CONFIG_KEY_MAP[propertyKey.name];

    if (!awsConfigKeyStatus) {
      // ToDo: Add unsupported comment in this case.
      return property;
    }

    if (awsConfigKeyStatus.newKeyName) {
      propertyKey.name = awsConfigKeyStatus.newKeyName;
    }

    if (awsConfigKeyStatus.description) {
      for (const commentLine in awsConfigKeyStatus.description.split("\n")) {
        property.comments = property.comments || [];
        property.comments.push(j.commentLine(commentLine));
      }
    }

    if (awsConfigKeyStatus.deprecationMessage) {
      property.comments = property.comments || [];
      property.comments.push(j.commentLine(getUnsuppportedCommentLine(propertyKey.name)));
      property.comments.push(
        j.commentLine(` @deprecated ${awsConfigKeyStatus.deprecationMessage}`)
      );
    }

    return property;
  });

  return objectExpression;
};
