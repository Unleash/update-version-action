import { BigQuery } from "@google-cloud/bigquery";
import * as core from "@actions/core";
import * as semver from "semver";
import { SemVer } from "semver";
export const MAIN_DATA_SET_NAME = "version";

export const VERSION_METADATA_TABLE_NAME = "version_metadata";

async function updateVersion(distribution: string, version: SemVer) {
  const bigquery = new BigQuery();

  const query = `UPDATE ${
    process.env.GCLOUD_PROJECT || "metrics-304612"
  }.${MAIN_DATA_SET_NAME}.${VERSION_METADATA_TABLE_NAME} SET version = @version WHERE distribution = @distribution`;
  const options = {
    query,
    location: "EU",
    params: {
      version: version.version,
      distribution: distribution,
    },
  };

  await bigquery.query(options);
}

export async function run(): Promise<void> {
  try {
    const distributionToUpdate = core.getInput("distribution");
    if (
      distributionToUpdate !== "oss" &&
      distributionToUpdate !== "enterprise"
    ) {
      throw new Error("Distribution must be either oss or enterprise");
    }
    let versionInput = core.getInput("version");
    if (versionInput.startsWith("v")) {
      versionInput = versionInput.slice(1);
    }
    const versionToSet = semver.parse(versionInput);
    if (!versionToSet) {
      throw new Error("Version must be a valid semver version");
    }
    await updateVersion(distributionToUpdate, versionToSet);
    core.setOutput("version", versionToSet.version);
    core.setOutput("status", "success");
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
