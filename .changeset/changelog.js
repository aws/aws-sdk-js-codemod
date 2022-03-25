const { config } = require("dotenv");

config();

const REPO = "awslabs/aws-sdk-js-codemod";

const getGithubCommitWithLink = (commit) =>
  `[${commit}](https://github.com/${REPO}/commit/${commit})`;

const getDependencyReleaseLine = (changesets, dependenciesUpdated) => {
  if (dependenciesUpdated.length === 0) return "";

  const changesetLink = `- Updated dependencies [${changesets
    .map(({ commit }) => (commit ? getGithubCommitWithLink(commit) : ""))
    .filter((_) => _)
    .join(", ")}]:`;

  const updatedDepsList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [changesetLink, ...updatedDepsList].join("\n");
};

const getReleaseLine = (changeset, _type) => {
  const { commit, summary } = changeset;
  const [firstLine, ...futureLines] = summary.split("\n").map((l) => l.trimRight());

  return `${firstLine} (${getGithubCommitWithLink(commit)})${
    futureLines.length > 0 ? futureLines.map((l) => `  ${l}`).join("\n") : ""
  }`;
};

module.exports = { getReleaseLine, getDependencyReleaseLine };
