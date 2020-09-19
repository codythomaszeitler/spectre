export const MasterBankConfig = {
  default: "Chase",
  configs: [
    {
      name: "Chase",
      imageFilePath: "assets/Chase-logo.png",
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
      imageFilePath: "assets/tiny_paypal.png",
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
