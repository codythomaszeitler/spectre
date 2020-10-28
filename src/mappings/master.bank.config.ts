import { RAW_FORMAT, SCEPTER_FORMAT, VENMO_FORMAT } from "../export/csv.type";
import { SCEPTER_CATEGORY_COLOR_COLUMN_NAME, SCEPTER_CATEGORY_ORDERING_COLUMN_NAME } from "../export/with.view.context.exporter";
import { CATEGORY_TYPE } from "../pojo/category";
import { COLOR_TYPE } from "../pojo/color";
import { AMOUNT_TYPE } from "../pojo/transaction";
import { STRING_TYPE } from "../pojo/transaction.detail";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../service/scepter.format.importer";
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
      name: "Point2",
      imageFilePath: require("../../assets/Chase-logo.png"),
      mappings: [
        {
          csvHeaderName: "Timestamp",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Description",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Outgoing",
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
          csvHeaderName: "Datetime",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "From",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "To",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Note",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount (total)",
          nodeFormatName: "Amount",
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
      mappings: [
        {
          csvHeaderName: "Account",
          nodeFormatName: "Account",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Date",
          nodeFormatName: "Date",
          type: DATE_TYPE,
        },
        {
          csvHeaderName: "Vendor",
          nodeFormatName: "Vendor",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Amount",
          nodeFormatName: "Amount",
          type: AMOUNT_TYPE,
        },
        {
          csvHeaderName: "Notes",
          nodeFormatName: "Notes",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: SCEPTER_CATEGORY_COLUMN_NAME,
          nodeFormatName: SCEPTER_CATEGORY_COLUMN_NAME,
          type: CATEGORY_TYPE,
        },
        {
          csvHeaderName: SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
          nodeFormatName: SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
          type: "number",
        },
        {
          csvHeaderName: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
          nodeFormatName: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
          type: COLOR_TYPE,
        },
      ],
    },
    {
      name: RAW_FORMAT.get(),
      mappings: [],
    },
  ],
};
