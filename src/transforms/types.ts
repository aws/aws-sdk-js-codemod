export type PositionalOptionsType = "boolean" | "number" | "string";

export interface AwsSdkJsCodemodTransformOption {
  /** array of values, limit valid option arguments to a predefined set */
  choices?: ReadonlyArray<boolean> | ReadonlyArray<number> | ReadonlyArray<string>;

  /** value, set a default value for the option */
  default?: boolean | number | string;

  /** string, the option description for help content */
  description: string;

  /** string, the type of the option */
  type: PositionalOptionsType;
}

export interface AwsSdkJsCodemodTransform {
  /** string, the name of the transform */
  name: string;

  /** string, the description of the transform for help content */
  description: string;

  /** array of TransformOption, the which can be passed to the transform */
  options: Array<AwsSdkJsCodemodTransformOption>;
}
