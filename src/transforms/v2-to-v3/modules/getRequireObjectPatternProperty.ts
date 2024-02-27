import { Collection, JSCodeshift, Literal } from "jscodeshift";
import { STRING_LITERAL_TYPE_LIST } from "../config";

export interface GetRequireObjectPatternPropertyOptions {
  identifierName: string;
  sourceValue: string;
}

export const getRequireObjectPatternProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, sourceValue }: GetRequireObjectPatternPropertyOptions
) => {
  const filter = {
    key: {
      type: "Identifier",
      name: identifierName,
    },
    value: {
      type: "Identifier",
    },
  } as const;

  const propertyCollection = source.find(j.Property, filter);
  const objectPropertyCollection = source.find(j.ObjectProperty, filter);
  const collection = propertyCollection.size() ? propertyCollection : objectPropertyCollection;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This expression is not callable.
  return collection.filter((path) => {
    const pathValueName = path.value.name;
    if (pathValueName && pathValueName !== sourceValue) return false;

    const varDeclarator = j(path).closest(j.VariableDeclarator);
    const init = varDeclarator.nodes()[0].init;
    if (!init || init.type !== "CallExpression") return false;

    const initCallee = init.callee;
    if (initCallee.type !== "Identifier" || initCallee.name !== "require") return false;

    const initArguments = init.arguments;
    if (initArguments.length !== 1) return false;
    const arg = initArguments[0];
    if (!STRING_LITERAL_TYPE_LIST.includes(arg.type)) return false;
    return (arg as Literal).value === sourceValue;
  });
};
