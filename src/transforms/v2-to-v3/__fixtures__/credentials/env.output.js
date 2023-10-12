import { fromEnv } from "@aws-sdk/credential-providers";

const credentials = fromEnv("AWS");