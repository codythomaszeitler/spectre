import { MasterMappingInfo } from "../master.info";

describe("Master Info", () => {
  const masterConfig = {
    default: "Chase",
    configs: [
      {
        name: "Chase",
        imageFilePath: "test file path",
        default: true,
        mappings: [
          {
            csvHeaderName: "Amount",
            nodeFormatName: "Amount",
          },
          {
            csvHeaderName: "Post Date",
            nodeFormatName: "Date",
          },
        ],
      },
      {
        name: "Paypal",
        imageFilePath: "",
        default: false,
        mappings: [
          {
            csvHeaderName: "Gross",
            nodeFormatName: "Amount",
          },
          {
            csvHeaderName: "Date",
            nodeFormatName: "Date",
          },
        ],
      },
    ],
  };

  it("should tell you the number of configurations", () => {
    const testObject = new MasterMappingInfo(masterConfig);
    expect(testObject.getConfigurationCount()).toBe(2);
  });

  it("should tell you the default config", () => {
    const testObject = new MasterMappingInfo(masterConfig);
    expect(testObject.getDefaultConfigName()).toBe("Chase");
  });

  it("should allow you to parse the chase bank configuration", () => {
    const testObject = new MasterMappingInfo(masterConfig);

    const chaseBankConfig = testObject.getConfigFor("Chase");
    expect(chaseBankConfig.getName()).toBe("Chase");
  });

  it("should allow you to get the file path name", () => {
    const testObject = new MasterMappingInfo(masterConfig);

    const chaseBankConfig = testObject.getConfigFor("Chase");
    expect(chaseBankConfig.getFilePath()).toBe("test file path");
  });

  it('should be able to parse all configs within the master info', () => {
    const testObject = new MasterMappingInfo(masterConfig);

    const configs = testObject.getConfigs();
    expect(configs.length).toBe(2);
  });
});
