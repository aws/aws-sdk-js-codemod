export const getTransformFileFromArgs = (args: string[]): string => {
  if (args.includes("-t")) {
    const transformIndex = args.indexOf("-t");
    return args[transformIndex + 1];
  }

  const transformArg = args.find((arg) => arg.startsWith("--transform="));
  if (!transformArg) {
    throw new Error("No transform file specified in -t or --transform.");
  }
  return transformArg.split("=")[1];
};
