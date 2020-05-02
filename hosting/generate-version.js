const { gitDescribeSync } = require("git-describe");
const replace = require("replace-in-file");

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false,
});
const buildVersion = gitInfo.raw;

const options = {
  files: "src/environments/environment.prod.ts",
  from: /{BUILD_VERSION}/g,
  to: buildVersion,
  allowEmptyPaths: false,
};

try {
  replace.sync(options);
  console.log("Build version set: " + buildVersion);
} catch (error) {
  console.error("Error occurred:", error);
}
