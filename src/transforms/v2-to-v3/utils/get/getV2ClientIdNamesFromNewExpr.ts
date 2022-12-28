import { Collection, Identifier, JSCodeshift, NewExpression } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";
import { getV2ClientNewExpression } from "./getV2ClientNewExpression";

export interface GetV2ClientIdNamesFromNewExprOptions {
  v2ClientName: string;
  v2GlobalName: string;
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
  { v2GlobalName, v2ClientName }: GetV2ClientIdNamesFromNewExprOptions
): string[] => {
  const namesFromGlobalModule = [];
  const namesFromServiceModule = [];

  for (const getNames of [getNamesFromVariableDeclarator, getNamesFromAssignmentPattern]) {
    namesFromGlobalModule.push(
      ...getNames(j, source, getV2ClientNewExpression({ v2GlobalName, v2ClientName }))
    );
    namesFromServiceModule.push(...getNames(j, source, getV2ClientNewExpression({ v2ClientName })));
  }

  return getMergedArrayWithoutDuplicates(namesFromGlobalModule, namesFromServiceModule);
};
