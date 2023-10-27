import { NewExpression, TSAsExpression } from "jscodeshift";

/**
 * Returns variants of new expressions to search for.
 */
export const getNewExpressionVariants = (newExpression: NewExpression) => {
  const newExpressionVariants = [newExpression];

  if (
    newExpression.callee.type === "MemberExpression" &&
    newExpression.callee.object.type === "Identifier"
  ) {
    newExpressionVariants.push({
      ...newExpression,
      callee: {
        ...newExpression.callee,
        object: {
          type: "TSAsExpression",
          expression: newExpression.callee.object,
        } as TSAsExpression,
      },
    });
  }

  return newExpressionVariants;
};
