import * as core from "@actions/core";
import * as index from "../src/index";

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, "debug");
const getInputMock = jest.spyOn(core, "getInput");
const setFailedMock = jest.spyOn(core, "setFailed");
const setOutputMock = jest.spyOn(core, "setOutput");

// Mock the action's entrypoint
const runMock = jest.spyOn(index, "run");

describe("action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`fails if distribution is not 'oss' or 'enterprise'`, async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "distribution":
          return "notoss";
        case "version":
          return "v5.4.2";
        default:
          return "";
      }
    });
    await index.run();
    expect(runMock).toHaveReturned();
    expect(setFailedMock).toHaveBeenCalledWith(
      "Distribution must be either oss or enterprise",
    );
  });

  it(`fails if version is not a valid semver version or a valid semver version prefixed with a single 'v'`, async () => {
    getInputMock.mockImplementation((name): string => {
      switch (name) {
        case "distribution":
          return "oss";
        case "version":
          return "obviouslynotasemver";
        default:
          return "";
      }
    });
    await index.run();
    expect(setFailedMock).toHaveBeenCalledWith(
      "Version must be a valid semver version",
    );
  });

  it(`succeeds if version is a valid semver version prefixed with 'v' and distribution is either 'oss' or 'enterprise'`, async () => {
    getInputMock.mockImplementation((name): string => {
      switch (name) {
        case "distribution":
          return "oss";
        case "version":
          return "v5.4.2";
        default:
          return "";
      }
    });
    jest.mock("@google-cloud/bigquery");
    await index.run();
    expect(runMock).toHaveReturned();
    expect(setOutputMock).toHaveBeenCalledWith("version", "5.4.2");
  });

  it(`succeeds if version is a valid semver version not prefixed with 'v' and distribution is either 'oss' or 'enterprise'`, async () => {
    getInputMock.mockImplementation((name): string => {
      switch (name) {
        case "distribution":
          return "oss";
        case "version":
          return "5.4.2";
        default:
          return "";
      }
    });
    jest.mock("@google-cloud/bigquery");
    await index.run();
    expect(runMock).toHaveReturned();
    expect(setOutputMock).toHaveBeenCalledWith("version", "5.4.2");
  });
});
