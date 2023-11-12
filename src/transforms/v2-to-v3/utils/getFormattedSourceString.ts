/**
 * Returns formatted source string for changes which can't be applied automatically.
 */
export const getFormattedSourceString = (source: string) =>
  source
    // Remove newlines from ObjectPattern requires.
    .replace(
      /\{\n {2}([\w]*)\n\} = require\((['"])@aws-sdk/g,
      (_, identifier, quote) => `{ ${identifier} } = require(${quote}@aws-sdk`
    );
