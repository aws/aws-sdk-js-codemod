import { ASTPath, ObjectExpression, ObjectProperty, Property } from "jscodeshift";
import { AWS_CONFIG_KEY_MAP, OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const replaceAwsConfigKeys = (objectExpression: ASTPath<ObjectExpression>) => {
  objectExpression.node.properties.forEach((property) => {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
      return;
    }
    const propertyKey = (property as Property | ObjectProperty).key;
    if (propertyKey.type !== "Identifier") {
      return;
    }
    const awsConfigKeyStatus = AWS_CONFIG_KEY_MAP[propertyKey.name];
    if (!awsConfigKeyStatus) {
      // ToDo: Add unsupported comment in this case.
      return;
    }
    if (awsConfigKeyStatus.newKeyName) {
      propertyKey.name = awsConfigKeyStatus.newKeyName;
    }
    if (awsConfigKeyStatus.description) {
      for (const commentLine in awsConfigKeyStatus.description.split("\n")) {
        propertyKey.comments = propertyKey.comments || [];
        propertyKey.comments.push({
          type: "CommentLine",
          value: commentLine,
        });
      }
    }
    if (awsConfigKeyStatus.deprecationMessage) {
      propertyKey.comments = propertyKey.comments || [];
      propertyKey.comments.push({
        type: "CommentLine",
        value: `@deprecated ${awsConfigKeyStatus.deprecationMessage}`,
      });
    }
  });
};
