"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.VERSION_METADATA_TABLE_NAME = exports.MAIN_DATA_SET_NAME = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const core = __importStar(require("@actions/core"));
const semver = __importStar(require("semver"));
exports.MAIN_DATA_SET_NAME = "version";
exports.VERSION_METADATA_TABLE_NAME = "version_metadata";
async function updateVersion(distribution, version) {
    const bigquery = new bigquery_1.BigQuery();
    const query = `UPDATE ${exports.MAIN_DATA_SET_NAME}.${exports.VERSION_METADATA_TABLE_NAME} SET version = '${version.version}' WHERE distribution = '${distribution}'`;
    const options = {
        query: query,
        location: "EU",
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
}
async function run() {
    try {
        const distributionToUpdate = core.getInput("distribution");
        if (distributionToUpdate !== "oss" &&
            distributionToUpdate !== "enterprise") {
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
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
exports.run = run;
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=index.js.map