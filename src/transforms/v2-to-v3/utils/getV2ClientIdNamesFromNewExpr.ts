import { Collection, Identifier, JSCodeshift, NewExpression } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";

export interface GetV2ClientIdNamesFromNewExprOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
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

export const getV2ClientIdNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: GetV2ClientIdNamesFromNewExprOptions
): string[] => {
  const defaultNewExpr = {
    type: "NewExpression",
    callee: {
      object: { type: "Identifier", name: v2DefaultModuleName },
      property: { type: "Identifier", name: v2ClientName },
    },
  } as NewExpression;

  const clientNewExpr = {
    type: "NewExpression",
    callee: { type: "Identifier", name: v2ClientName },
  } as NewExpression;

  const namesFromDefaultModule = [
    ...getNamesFromVariableDeclarator(j, source, defaultNewExpr),
    ...getNamesFromAssignmentPattern(j, source, defaultNewExpr),
  ];
  const namesFromServiceModule = [
    ...getNamesFromVariableDeclarator(j, source, clientNewExpr),
    ...getNamesFromAssignmentPattern(j, source, clientNewExpr),
  ];

  return getMergedArrayWithoutDuplicates(namesFromDefaultModule, namesFromServiceModule);
};
