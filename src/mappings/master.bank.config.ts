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
        {
          csvHeaderName: "Description",
          nodeFormatName: "Name",
        }
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
        {
          csvHeaderName: "Name",
          nodeFormatName: "Name",
        }
      ],
    },
    {
      name : 'Scepter',
      imageFilePath: require("../../assets/tiny_paypal.png"),
      default: false,
      mappings : []
    },
    {
      name : 'Raw',
      imageFilePath: require("../../assets/tiny_paypal.png"),
      default: false,
      mappings : []
    },
  ],
};
