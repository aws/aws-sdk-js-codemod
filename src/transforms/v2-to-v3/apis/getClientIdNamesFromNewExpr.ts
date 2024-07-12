import type {
  Collection,
  Identifier,
  JSCodeshift,
  MemberExpression,
  NewExpression,
} from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import {
  getClientNewExpressionFromGlobalName,
  getClientNewExpressionFromLocalName,
} from "../utils";

export interface GetClientIdNamesFromNewExprOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

const getNamesFromVariableDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  newExpression: NewExpression
) =>
  source
    .find(j.VariableDeclarator, { id: { type: "Identifier" }, init: newExpression })
    .nodes()
    .map((variableDeclarator) => (variableDeclarator.id as Identifier).name);

const getNamesFromAssignmentPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  newExpression: NewExpression
) =>
  source
    .find(j.AssignmentPattern, { left: { type: "Identifier" }, right: newExpression })
    .nodes()
    .map((assignmentPattern) => (assignmentPattern.left as Identifier).name);

const getNamesFromThisMemberExpression = (
  j: JSCodeshift,
  source: Collection<unknown>,
  newExpression: NewExpression
) =>
  source
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        object: { type: "ThisExpression" },
        property: { type: "Identifier" },
      },
      right: newExpression,
    })
    .nodes()
    .map(
      (assignmentExpression) =>
        ((assignmentExpression.left as MemberExpression).property as Identifier).name
    );

export const getClientIdNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetClientIdNamesFromNewExprOptions
): string[] => {
  const namesFromGlobalModule = [];
  const namesFromServiceModule = [];

  for (const getNames of [
    getNamesFromVariableDeclarator,
    getNamesFromAssignmentPattern,
    getNamesFromThisMemberExpression,
  ]) {
    if (v2GlobalName) {
      namesFromGlobalModule.push(
        ...getNames(j, source, getClientNewExpressionFromGlobalName(v2GlobalName, v2ClientName))
      );
      if (v2ClientName === DYNAMODB) {
        namesFromGlobalModule.push(
          ...getNames(
            j,
            source,
            getClientNewExpressionFromGlobalName(v2GlobalName, DYNAMODB_DOCUMENT_CLIENT)
          )
        );
      }
    }
    namesFromServiceModule.push(
      ...getNames(j, source, getClientNewExpressionFromLocalName(v2ClientLocalName))
    );
    if (v2ClientName === DYNAMODB) {
      namesFromServiceModule.push(
        ...getNames(
          j,
          source,
          getClientNewExpressionFromLocalName(`${v2ClientLocalName}.${DOCUMENT_CLIENT}`)
        )
      );
    }
  }

  return [...new Set([...namesFromGlobalModule, ...namesFromServiceModule])];
};
