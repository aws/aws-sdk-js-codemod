import AWS from "aws-sdk";

AWS.util.arrayEach(["one", "two", "three"], (item, index) => {
  console.log({ index, item });
});