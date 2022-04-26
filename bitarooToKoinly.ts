/**
 *
 * The json payload returned from https://www.binance.com/bapi/margin/v1/private/new-otc/query-trade-history?startTime=1619791200000&endTime=1624975199999&page=1&rows=20
 *
 * To get this data yourself, open up chrome devtools then go to the network tab.
 *
 * Once youve set your start/end dates, click the "Search" button.
 *
 * Right click on the network request and select Copy > Response
 *
 * Then paste into the 'binanceData.json' file in the same folder as this file.
 */

import bitarooTrades from "./data/trades.json";

type BitarooTrades = typeof bitarooTrades[number] & {
  side: "buy" | "sell";
  role: "taker" | "maker";
};

type KoinlyTrade = {
  "Koinly Date": string;
  Pair: string;
  Side: "BUY" | "SELL";
  Amount: number;
  Total: number;
  "Fee Amount": number;
  "Fee Currency": string;
  "Order ID"?: string;
  "Trade ID": string;
};

type IKoinly = {
  koinlyDate: KoinlyTrade["Koinly Date"];
  pair: KoinlyTrade["Pair"];
  side: KoinlyTrade["Side"];
  amount: KoinlyTrade["Amount"];
  total: KoinlyTrade["Total"];
  feeAmount: KoinlyTrade["Fee Amount"];
  feeCurrency: KoinlyTrade["Fee Currency"];
  orderId?: KoinlyTrade["Order ID"];
  tradeId: KoinlyTrade["Trade ID"];
};

type TransformedKoinlyTrade = BitarooTrades & KoinlyTrade;

/** Maps BinanceColumns to KoinlyColumns */
const convertBinanceToKoinly: (binanceEvent: BitarooTrades) => void = (
  binanceColumns,
) => {
  const {
    feeAmount,
    feeCurrency,
    koinlyDate,
    pair,
    side,
    total,
    tradeId,
    orderId,
    amount,
  } = convertBitarooTradesToKoinly(binanceColumns);
  const convertedKoinlyData: TransformedKoinlyTrade = {
    ...binanceColumns,
    "Koinly Date": koinlyDate,
    Pair: pair,
    Side: side,
    Amount: amount,
    Total: total,
    "Fee Amount": feeAmount,
    "Fee Currency": feeCurrency,
    "Trade ID": tradeId,
    "Order ID": orderId,
  };

  // if (binanceColumns.fromCoin === "ADA") {
  csvStream.write(convertedKoinlyData);
  // }

  // return convertedKoinlyData;
};

/** Get Pair from binanceColumns */
const convertBitarooTradesToKoinly: (
  bitarooTrades: BitarooTrades,
) => IKoinly = (bitarooColumns) => {
  const {
    amount,
    fee,
    orderId,
    price,
    recordId,
    role,
    side,
    timestamp,
    tradeId,
  } = bitarooColumns;

  const koinlyDate = new Date(bitarooColumns.timestamp).toISOString();

  const pair = side === "buy" ? `AUD-BTC` : `BTC-AUD`;

  const koinly: IKoinly = {
    koinlyDate,
    pair,
    side: "SELL",
    feeCurrency: "AUD",
    feeAmount: Number(fee),
    total: Number(toCoinAmount),
    amount: Number(fromCoinAmount),
    orderId,
    tradeId: quoteId,
  };

  return koinly;
};

import * as csv from "fast-csv";

const csvStream = csv.format({ headers: true });

csvStream.pipe(process.stdout).on("end", () => process.exit());

const converted: TransformedKoinlyTrade[] = [];

conversions.forEach(convertBinanceToKoinly);
// csvStream.write({ header1: "row1-col1", header2: "row1-col2" });
// csvStream.write({ header1: "row2-col1", header2: "row2-col2" });
// csvStream.write({ header1: "row3-col1", header2: "row3-col2" });
// csvStream.write({ header1: "row4-col1", header2: "row4-col2" });
// csvStream.write({ header1: "row5-col1", header2: "row5-col2" });

csvStream.end();
