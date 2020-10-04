import { RAW_FORMAT, SCEPTER_FORMAT, VENMO_FORMAT } from "../export/csv.type";
import { STRING_TYPE } from "../pojo/transaction.detail";
import { DATE_TYPE } from "../transaction.detail.converter/date.converter";

export const MasterBankConfig = {
  default: RAW_FORMAT.get(),
  configs: [
    {
      name: "Chase",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type : STRING_TYPE
        },
        {
          csvHeaderName: "Post Date",
          nodeFormatName: "Date",
          type : DATE_TYPE
        },
        {
          csvHeaderName: "Description",
          nodeFormatName: "Name",
          type : STRING_TYPE
        }
      ],
    },
    {
      name: VENMO_FORMAT.get(),
      imageFilePath: require("../../assets/venmo.png"),
      mappings: [
        {
          csvHeaderName: "Amount (total)",
          nodeFormatName: "Amount",
          type : STRING_TYPE 
        },
        {
          csvHeaderName: "Datetime",
          nodeFormatName: "Date",
          type : DATE_TYPE
        },
        {
          csvHeaderName: "Note",
          nodeFormatName: "Name",
          type : STRING_TYPE
        }
      ],
    },
    {
      name : 'Paypal',
      imageFilePath: require("../../assets/tiny_paypal.png"),
      mappings: [
        {
          csvHeaderName: "Gross",
          nodeFormatName: "Amount",
          type : STRING_TYPE
        },
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type : DATE_TYPE
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Name",
          type : STRING_TYPE
        }
      ],
    },
    {
      name : SCEPTER_FORMAT.get(),
      imageFilePath: require("../../assets/tiny_paypal.png"),
      mappings : []
    },
    {
      name : RAW_FORMAT.get(),
      mappings : []
    },
  ],
};
