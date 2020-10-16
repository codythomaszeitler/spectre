import { RAW_FORMAT, SCEPTER_FORMAT, VENMO_FORMAT } from "../export/csv.type";
import { STRING_TYPE } from "../pojo/transaction.detail";
import { DATE_TYPE } from "../transaction.detail.converter/date.converter";

export const MasterBankConfig = {
  default: RAW_FORMAT.get(),
  configs: [
    {
      name: "Chase-Credit",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Transaction Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Description",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Category",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "Chase-Checking",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Posting Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Description",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Type",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "Chase-Saving",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Posting Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Description",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Type",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "USBank-Credit",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Transaction Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Memo",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "USBank-Checking",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Memo",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "USBank-Reserve",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Memo",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "USBank-Saving",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Memo",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "Point",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Date Created",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "To User Nickname",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Note",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: VENMO_FORMAT.get(),
      imageFilePath: require("../../assets/venmo.png"),
      mappings: [
        {
          csvHeaderName: "Amount (total)",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Datetime",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Note",
          nodeFormatName: "Name",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: "Paypal",
      imageFilePath: require("../../assets/tiny_paypal.png"),
      mappings: [
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Name",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Type",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Gross",
          nodeFormatName: "Amount",
          type: STRING_TYPE,
        },
      ],
    },
    {
      name: SCEPTER_FORMAT.get(),
      imageFilePath: require("../../assets/tiny_paypal.png"),
      mappings: [],
    },
    {
      name: RAW_FORMAT.get(),
      mappings: [],
    },
  ],
};
