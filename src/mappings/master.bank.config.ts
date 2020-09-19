export const MasterBankConfig = {
  default: "Chase",
  configs: [
    {
      name: "Chase",
      imageFilePath: require("../../assets/Chase-logo.png"),
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
      name : 'Paypal',
      imageFilePath: require("../../assets/tiny_paypal.png"),
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
