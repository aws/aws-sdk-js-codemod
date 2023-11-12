/**
 * Returns formatted source string for changes which can't be applied automatically.
 */
export const getFormattedSourceString = (source: string) =>
  source
    // Remove newlines from ObjectPattern requires.
    .replace(
      /\{\n {2}([\w,\n ]+)\n\} = require\((['"])@aws-sdk/g,
      (_, identifiers, quote) =>
        `{ ${identifiers.split(",\n  ").join(", ")} } = require(${quote}@aws-sdk`
    );
