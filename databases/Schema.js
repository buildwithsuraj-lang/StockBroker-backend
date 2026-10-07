const mongoose = require("mongoose");
const tradingFeatures = {
  tradingPlatform: Boolean,
  mobileApp: Boolean,
  webPlatform: Boolean,
  ipo: Boolean,
  mutualFunds: Boolean,
  etfs: Boolean,
  commodities: Boolean,
  currency: Boolean,
  api: Boolean,
  research: Boolean,
  customerSupport: Boolean,
};
const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["Discount Broker", "Full Service Broker"],
      default: "Discount Broker",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    accountOpeningFee: {
      type: String,
      default: 0,
    },

    maintenanceFee: {
      type: String,
      default: 0,
    },

    equityDelivery: {
      type: String,
      default: 0,
    },

    intraday: {
      type: String,
      default: 0,
    },
    sebiRegistrationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    affiliateLink: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    Gst:{
      type:String,
      default:"",
    },
    Stt:{
      type:String,
    },
    ExchangeCharges:{
      type:String
    },
    SebiCharges:{
      type:String
    },
    StampDuty:{
      type:String
    },
    DpCharges:{
      type:String
    },
    Futures:{
      type:String
    },
    Options:{
      type:String
    },
    Established:{
      type:Number
    },
    Trading:tradingFeatures,
  },
  {
    timestamps: true,
  }
);


const Broker = mongoose.model("Broker", brokerSchema);


module.exports = Broker;