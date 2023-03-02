import { Collection, Identifier, JSCodeshift, NewExpression } from "jscodeshift";

import { getClientNewExpression } from "../utils";

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
    .find(j.VariableDeclarator, {
      id: { type: "Identifier" },
      init: newExpression,
    })
    .nodes()
    .map((variableDeclarator) => (variableDeclarator.id as Identifier).name);

const getNamesFromAssignmentPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  newExpression: NewExpression
) =>
  source
    .find(j.AssignmentPattern, {
      left: { type: "Identifier" },
      right: newExpression,
    })
    .nodes()
    .map((assignmentPattern) => (assignmentPattern.left as Identifier).name);

export const getClientIdNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetClientIdNamesFromNewExprOptions
): string[] => {
  const namesFromGlobalModule = [];
  const namesFromServiceModule = [];

  for (const getNames of [getNamesFromVariableDeclarator, getNamesFromAssignmentPattern]) {
    if (v2GlobalName) {
      namesFromGlobalModule.push(
        ...getNames(j, source, getClientNewExpression({ v2GlobalName, v2ClientName }))
      );
    }
    namesFromServiceModule.push(
      ...getNames(j, source, getClientNewExpression({ v2ClientLocalName }))
    );
  }

  return [...new Set([...namesFromGlobalModule, ...namesFromServiceModule])];
};