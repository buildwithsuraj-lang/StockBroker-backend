const express = require("express");
const Router = express.Router();
const Broker = require("../databases/Schema");
const BrokerageRule = require("../databases/brokerageRuleSchema");

Router.post("/app", async (req, res) => {
  console.log(req.body);
  try {
    const broker = await Broker.create(req.body);
    console.log(broker);
    return res.status(201).json({
      success: true,
      message: "Broker added successfully",
      data: broker,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Broker already exists",
      });
    }
  }
});
Router.get("/data", async (req, res) => {
  const data = await Broker.find();
  res.status(200).json({
    sucess: true,
    message: data,
  });
});

Router.post("/compare", async (req, res) => {
  const { data, datas } = req.body;

  try {
    const firstcompare = await Broker.findOne({ name: data });
    const secondcompare = await Broker.findOne({ name: datas });
    const merge = [];
    merge.push(firstcompare, secondcompare);
    res.json(merge);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

Router.post("/brokerage", async (req, res) => {
  try {
    const data = await BrokerageRule.create(req.body);
    console.log(data);
    res.status(200).json({
      sucess: true,
      message: data,
    });
    if (!data) {
  return res.status(404).json({
    success: false,
    message: "Broker not found"
  });
}
  } catch (error) {
    if (error.code === 11000) {
      console.log("Name already exists");

      return res.status(409).json({
        success: false,
        message: "Broker already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

Router.post("/calculate",async (req, res) => {

  const { tradeType, exchange, broker, buyPrice, sellPrice, quantity } =req.body;
  let ExchangeCharges = 0;
  let turnover = buyPrice * quantity + sellPrice * quantity;
  let grossprofit = sellPrice * quantity - buyPrice * quantity;
    try{
  const data=await Broker.findOne({name:broker})
    const link=(data.affiliateLink)
  const brokers = await BrokerageRule.findOne({brokerName:broker});
      if (!brokers) {
  return res.status(404).json({
    success: false,
    message: "Brokerage rules not found"
  });
}
  if (tradeType === "equity") {
    if (exchange === "NSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.equity.transactionCharge.NSE) / 100).toFixed(2),
      );
    }
    if (exchange === "BSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.equity.transactionCharge.BSE) / 100).toFixed(2),
      );
    }
      let dpcharge=brokers.equity.DpCharge
     const brok = Math.min( turnover * brokers.equity.brokerage.rate / 100, brokers.equity.brokerage.max);
    let stt =
      buyPrice * quantity * (brokers.equity.stt.buy / 100) +
      sellPrice * quantity * (brokers.equity.stt.sell / 100);
    const sebi = (turnover * brokers.equity.sebiCharge) / 100;
    let gst = Number(
      (brokers.equity.gst / 100) * (ExchangeCharges + sebi+brok+dpcharge),
    ).toFixed(2);
    let sebicharges = Number(
      ((turnover * brokers.equity.sebiCharge) / 100).toFixed(2),
    );
  
    let stampduty = Number(
      (buyPrice * quantity * (brokers.equity.stampDuty.rate / 100)).toFixed(2),
    );
   console.log(brokers.intraday.DpCharge)
   let ipft=Number((turnover*brokers.intraday.DpCharge/10000000).toFixed(2))

    let totalCharges =  Number(brok)+Number(stt)+Number(ExchangeCharges)+Number(gst)+Number(sebicharges)+
       Number(stampduty)+Number(dpcharge)+Number(ipft);
    let netprofit=grossprofit - totalCharges
     
        res.json({brok,stt,ExchangeCharges,gst,sebicharges,stampduty,totalCharges,netprofit,tradeType,
          turnover,grossprofit,exchange,dpcharge,link,ipft})
  }
   if (tradeType === "intraday") {
    if (exchange === "NSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.intraday.transactionCharge.NSE) / 100).toFixed(2),
      );
    }
    if (exchange === "BSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.intraday.transactionCharge.BSE) / 100).toFixed(2),
      );
    }
      let dpcharge=brokers.intraday.DpCharge
     const brok = Math.min( turnover * brokers.intraday.brokerage.rate / 100, brokers.intraday.brokerage.max);
    let stt =
      buyPrice * quantity * (brokers.intraday.stt.buy / 100) +
      sellPrice * quantity * (brokers.intraday.stt.sell / 100);
    const sebi = (turnover * brokers.intraday.sebiCharge) / 100;
    let gst = Number(
      (brokers.intraday.gst / 100) * (ExchangeCharges + sebi+brok+dpcharge),
    ).toFixed(2);
    let sebicharges = Number(
      ((turnover * brokers.intraday.sebiCharge) / 100).toFixed(2),
    );
  
    let stampduty = Number(
      (buyPrice * quantity * (brokers.intraday.stampDuty.rate / 100)).toFixed(2),
    );

   let ipft=Number((turnover*brokers.intraday.DpCharge/10000000).toFixed(2))

    let totalCharges =  Number(brok)+Number(stt)+Number(ExchangeCharges)+Number(gst)+Number(sebicharges)+
       Number(stampduty)+Number(dpcharge)+Number(ipft);
    let netprofit=grossprofit - totalCharges
     
        res.json({brok,stt,ExchangeCharges,gst,sebicharges,stampduty,totalCharges,netprofit,tradeType,
          turnover,grossprofit,exchange,dpcharge,link,ipft})
  }
   if (tradeType === "futures") {
    if (exchange === "NSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.futures.transactionCharge.NSE) / 100).toFixed(2),
      );
    }
    if (exchange === "BSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.futures.transactionCharge.BSE) / 100).toFixed(2),
      );
    }
      let dpcharge=brokers.futures.DpCharge
     const brok = Math.min( turnover * brokers.futures.brokerage.rate / 100, brokers.futures.brokerage.max);
    let stt =
      buyPrice * quantity * (brokers.futures.stt.buy / 100) +
      sellPrice * quantity * (brokers.futures.stt.sell / 100);
    const sebi = (turnover * brokers.futures.sebiCharge) / 100;
    let gst = Number(
      (brokers.futures.gst / 100) * (ExchangeCharges + sebi+brok+dpcharge),
    ).toFixed(2);
    let sebicharges = Number(
      ((turnover * brokers.futures.sebiCharge) / 100).toFixed(2),
    );
  
    let stampduty = Number(
      (buyPrice * quantity * (brokers.futures.stampDuty.rate / 100)).toFixed(2),
    );

   let ipft=Number((turnover*brokers.futures.DpCharge/10000000).toFixed(2))

    let totalCharges =  Number(brok)+Number(stt)+Number(ExchangeCharges)+Number(gst)+Number(sebicharges)+
       Number(stampduty)+Number(dpcharge)+Number(ipft);
    let netprofit=grossprofit - totalCharges
     
        res.json({brok,stt,ExchangeCharges,gst,sebicharges,stampduty,totalCharges,netprofit,tradeType,
          turnover,grossprofit,exchange,dpcharge,link,ipft})
  }   if (tradeType === "options") {
    if (exchange === "NSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.options.transactionCharge.NSE) / 100).toFixed(2),
      );
    }
    if (exchange === "BSE") {
      ExchangeCharges = Number(
        ((turnover * brokers.options.transactionCharge.BSE) / 100).toFixed(2),
      );
    }
      let dpcharge=brokers.futures.DpCharge
     const brok = Math.min( turnover * brokers.options.brokerage.rate / 100, brokers.options.brokerage.max);
    let stt =
      buyPrice * quantity * (brokers.options.stt.buy / 100) +
      sellPrice * quantity * (brokers.options.stt.sell / 100);
    const sebi = (turnover * brokers.options.sebiCharge) / 100;
    let gst = Number(
      (brokers.futures.gst / 100) * (ExchangeCharges + sebi+brok+dpcharge),
    ).toFixed(2);
    let sebicharges = Number(
      ((turnover * brokers.options.sebiCharge) / 100).toFixed(2),
    );
  
    let stampduty = Number(
      (buyPrice * quantity * (brokers.options.stampDuty.rate / 100)).toFixed(2),
    );

   let ipft=Number((turnover*brokers.options.DpCharge/10000000).toFixed(2))

    let totalCharges =  Number(brok)+Number(stt)+Number(ExchangeCharges)+Number(gst)+Number(sebicharges)+
       Number(stampduty)+Number(dpcharge)+Number(ipft);
    let netprofit=grossprofit - totalCharges
     
        res.json({brok,stt,ExchangeCharges,gst,sebicharges,stampduty,totalCharges,netprofit,tradeType,
          turnover,grossprofit,exchange,dpcharge,link,ipft})
  }
}catch(error){
    return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}
});
module.exports = Router;
