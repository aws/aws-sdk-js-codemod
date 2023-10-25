import { JSCodeshift, ObjectExpression, ObjectProperty, Property } from "jscodeshift";
import { AWS_CONFIG_KEY_MAP, OBJECT_PROPERTY_TYPE_LIST } from "../config";

const getRenameComment = (keyName: string, newKeyName: string) =>
  ` The key ${keyName} was renamed to ${newKeyName}.`;

const getUnsuppportedComment = (keyName: string) =>
  ` The key ${keyName} is no longer supported in v3, and can be removed.`;

const getCodemodUnsuppportedComments = (keyName: string) => [
  ` The transformation for ${keyName} is not implemented.`,
  ` Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.`,
  ` Please create/upvote feature request on aws-sdk-js-codemod for ${keyName}.`,
];

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
      property.comments = property.comments || [];
      for (const commentLine of getCodemodUnsuppportedComments(propertyKey.name)) {
        property.comments.push(j.commentLine(commentLine));
      }
      return property;
    }

    if (awsConfigKeyStatus.newKeyName) {
      property.comments = property.comments || [];
      property.comments.push(
        j.commentLine(getRenameComment(propertyKey.name, awsConfigKeyStatus.newKeyName))
      );
      propertyKey.name = awsConfigKeyStatus.newKeyName;
    }

    if (awsConfigKeyStatus.description) {
      property.comments = property.comments || [];
      for (const commentLine of awsConfigKeyStatus.description.split("\n")) {
        property.comments.push(j.commentLine(` ${commentLine}`));
      }
    }

    if (awsConfigKeyStatus.deprecationMessage) {
      property.comments = property.comments || [];
      property.comments.push(j.commentLine(getUnsuppportedComment(propertyKey.name)));
      property.comments.push(
        j.commentLine(` @deprecated ${awsConfigKeyStatus.deprecationMessage}`)
      );
    }

    return property;
  });

  return objectExpression;
};
