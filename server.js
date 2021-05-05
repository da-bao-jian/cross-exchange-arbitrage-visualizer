const express = require("express");
const app = express();


const port = process.env.PORT || 5000;
app.get("/", (req, res) => res.send(" World"));
app.listen(port, () => console.log(`Server is running on port ${port}`));
















// const ccxws = require("ccxws");
// const binance = new ccxws.Binance();

// // market could be from CCXT or genearted by the user
// const market = {
//   id: "BTCUSDT", // remote_id used by the exchange
//   base: "BTC", // standardized base symbol for Bitcoin
//   quote: "USDT", // standardized quote symbol for Tether
// };

// // // handle trade events
// binance.on("trade", trade => console.log(trade));

// // // handle level2 orderbook snapshots
// binance.on("l2snapshot", snapshot => console.log(snapshot));

// // subscribe to trades
// binance.subscribeTrades(market);

// // subscribe to level2 orderbook snapshots
// binance.subscribeLevel2Snapshots(market);