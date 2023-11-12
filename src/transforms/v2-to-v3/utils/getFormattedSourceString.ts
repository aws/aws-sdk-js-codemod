/**
 * Returns formatted source string for changes which can't be applied automatically.
 */
export const getFormattedSourceString = (source: string) =>
  source
    // Remove newlines from ObjectPattern require declarations.
    .replace(
      /\{\n {2}([\w,\n ]+)\n\} = require\((['"])@aws-sdk/g,
      (_, identifiers, quote) =>
        `{ ${identifiers
          .split(",")
          .map((str: string) => str.trimLeft())
          .filter((str: string) => str !== "")
          .join(", ")} } = require(${quote}@aws-sdk`
    )
    // Remove extra newlines between require declarations.
    .replace(
      /@aws-sdk\/([\w-]+)(['"])\);\n\nconst \{/g,
      (_, packageName, quote) => `@aws-sdk/${packageName}${quote});\nconst {`
    );
