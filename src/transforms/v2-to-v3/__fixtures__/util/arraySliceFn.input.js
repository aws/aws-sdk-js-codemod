import AWS from "aws-sdk";

const data = ["one", "two", "three"];
const sliceFn = AWS.util.arraySliceFn(data);