import type { AwsSdkJsCodemodTransform } from "../transforms/index.ts";

const getWrappedBlocks = (sentence: string, blockLength: number): string[] => {
  const words = sentence.split(" ");
  const blocks = [];
  let currentBlock = "";

  // iterate over the words and add them to blocks
  for (const word of words) {
    // if the current block plus the next word is longer than the block length,
    // add the current block to the list of blocks and start a new block
    if (currentBlock.length + word.length > blockLength) {
      blocks.push(currentBlock);
      currentBlock = "";
    }

    // add the word to the current block
    currentBlock += `${word} `;
  }

  // add the final block to the list of blocks
  blocks.push(currentBlock);

  return blocks;
};

export const getTransformDescription = (transform: AwsSdkJsCodemodTransform): string[] => {
  const descriptionArr: string[] = [];

  const columnLength = 15;
  const borderLength = 2;

  descriptionArr[0] =
    " ".repeat(columnLength - borderLength - transform.name.length) +
    transform.name +
    " ".repeat(borderLength);

  const wrappedBlocks = getWrappedBlocks(transform.description, 80);

  descriptionArr[0] += wrappedBlocks[0];
  for (let i = 1; i < wrappedBlocks.length; i++) {
    descriptionArr.push(" ".repeat(columnLength) + wrappedBlocks[i]);
  }

  return descriptionArr;
};
