const mongoose = require("mongoose");

const brokerageSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      default: 0,
    },

    max: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);


const sttSchema = new mongoose.Schema(
  {
    buy: {
      type: Number,
      default: 0,
    },

    sell: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);


const transactionChargeSchema = new mongoose.Schema(
  {
    NSE: {
      type: Number,
      default: 0,
    },

    BSE: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);


const stampDutySchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      default: 0,
    },

    max: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);


const segmentChargeSchema = new mongoose.Schema(
  {
    brokerage: {
      type: brokerageSchema,
      default: () => ({}),
    },

    stt: {
      type: sttSchema,
      default: () => ({}),
    },

    transactionCharge: {
      type: transactionChargeSchema,
      default: () => ({}),
    },

    gst: {
      type: Number,
      default: 18,
    },

    sebiCharge: {
      type: Number,
      default: 0,
    },
    DpCharge:{
      type:Number,
      default:0,
    },

    stampDuty: {
      type: stampDutySchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const brokerChargeSchema = new mongoose.Schema(
  {
    brokerName: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
     
    equity: {
      type: segmentChargeSchema,
      default: () => ({}),
    },

    intraday: {
      type: segmentChargeSchema,
      default: () => ({}),
    },

    futures: {
      type: segmentChargeSchema,
      default: () => ({}),
    },

    options: {
      type: segmentChargeSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);



 const brokerageRuleSchema= mongoose.model(
  "BrokerCharge",
  brokerChargeSchema
);

module.exports =brokerageRuleSchema;