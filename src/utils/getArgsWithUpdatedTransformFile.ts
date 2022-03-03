export const getArgsWithUpdatedTransformFile = (
  args: string[],
  updatedTransformFile: string
): string[] => {
  if (args.includes("-t")) {
    const transformIndex = args.indexOf("-t");
    args[transformIndex + 1] = updatedTransformFile;
    return args;
  }

  const transformArg = args.find((arg) => arg.startsWith("--transform="));
  if (!transformArg) {
    throw new Error("No transform file specified in -t or --transform.");
  }
  const transformIndex = args.indexOf(transformArg);
  args[transformIndex] = `--transform=${updatedTransformFile}`;
  return args;
};
