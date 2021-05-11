import {
	ws_bitmex$,
	ws_bitstamp$,
	ws_ftx$,
	ws_binance$,
	ws_coinbase$,
	ws_kraken$,
	ws_bitfinex$,
	ws_bybit$,
} from "./websocket_connection";
import { retryWhen, scan, map } from "rxjs/operators";
import { timer } from "rxjs";

export const bitstampSocketSetup = (currencyPair) =>
	ws_bitstamp$
		.multiplex(
			() => ({
				event: "bts:subscribe",
				data: { channel: `order_book_${currencyPair}` },
			}),
			() => ({
				event: "bts:unsubscribe",
				data: { channel: `order_book_${currencyPair}` },
			}),
			(msg) => msg.channel === `order_book_${currencyPair}`
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (Object.keys(nextItem["data"]).length > 0) {
					//initialize a hash and setting keys asks and bids with orders on top of both sides
					accumulatedData["bids"] = nextItem["data"]["bids"][0];
					accumulatedData["asks"] = nextItem["data"]["asks"][0];
				}
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				//error handling: reconnect if online, otherwise wait for internet connection
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);

export const bitmexSocketSetup = (currencyPair) =>
	ws_bitmex$
		.multiplex(
			() => ({ op: "subscribe", args: [`quote:${currencyPair}`] }),
			() => ({ op: "unsubscribe", args: [`quote:${currencyPair}`] }),
			(msg) => {
				if (msg["data"] !== undefined && msg["data"].length > 0) {
					return msg["data"][0]["symbol"] === currencyPair;
				} else {
					return false;
				}
			}
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				accumulatedData["bids"] = [
					nextItem["data"][0]["bidPrice"],
					nextItem["data"][0]["bidSize"] / nextItem["data"][0]["bidPrice"],
				]; //on Bitmex, size 1 = 1USD so size/price denotes unit number of 'token' on the book
				accumulatedData["asks"] = [
					nextItem["data"][0]["askPrice"],
					nextItem["data"][0]["askSize"] / nextItem["data"][0]["askPrice"],
				];
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);

export const ftxSocketSetup = (currencyPair) =>
	ws_ftx$
		.multiplex(
			() => ({ op: "subscribe", channel: "ticker", market: currencyPair }),
			() => ({ op: "unsubscribe", channel: "ticker", market: currencyPair }),
			(msg) => msg.market === currencyPair && msg.data !== undefined
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (Object.keys(nextItem["data"]).length > 0) {
					accumulatedData["bids"] = [
						nextItem["data"]["bid"],
						nextItem["data"]["bidSize"],
					];
					accumulatedData["asks"] = [
						nextItem["data"]["ask"],
						nextItem["data"]["askSize"],
					];
				}
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);

export const binanceSocketSetup = (currencyPair, id) =>(
	ws_binance$
    .multiplex(
        () => ({
            method: "SUBSCRIBE",
            params: [`${currencyPair}@bookTicker`],
            id: id,
        }),
        () => ({
            method: "UNSUBSCRIBE",
            params: [`${currencyPair}@bookTicker`],
            id: id,
        }),
        (msg) => {
            return msg.stream === `${currencyPair}@bookTicker`;
        }
    )
    .pipe(
        scan((accumulatedData, nextItem) => {
            if (Object.keys(nextItem["data"]).length > 0) {
                accumulatedData["bids"] = [
                    nextItem["data"]["b"],
                    nextItem["data"]["B"],
                ];
                accumulatedData["asks"] = [
                    nextItem["data"]["a"],
                    nextItem["data"]["A"],
                ];
            }
            return accumulatedData;
        }, {}),
        retryWhen((err) => {
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, "online");
            }
        })
    )
)
// coinbase's ticker channel don't provide volume for best bid/ask price, therefore it subscribes to level2 book channel to extrapolate the data
export const coinbaseSocketSetup = (currencyPair) => {
	let bids, asks;
	return ws_coinbase$
		.multiplex(
			() => ({
				type: "subscribe",
				product_ids: [currencyPair],
				channels: ["ticker"],
			}),
			() => ({
				type: "unsubscribe",
				product_ids: [currencyPair],
				channels: ["ticker"],
			}),
			(msg) => {
				return msg.product_id === currencyPair;
			}
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (Object.keys(nextItem).length > 0) {
					accumulatedData["bids"] = [nextItem['best_bid'], null];
					accumulatedData["asks"] = [nextItem['best_ask'], null];
				} 
                
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
                    
					return timer(10000);
				} else {
                    
					return fromEvent(window, "online");
				}
			})
		);
};

export const krakenSocketSetup = (currencyPair) =>
	ws_kraken$
		.multiplex(
			() => ({
				event: "subscribe",
				pair: [currencyPair],
				subscription: { name: "ticker" },
			}),
			() => ({
				event: "unsubscribe",
				pair: [currencyPair],
				subscription: { name: "ticker" },
			}),
			(msg) => {
				return msg[3] === currencyPair;
			}
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (nextItem.length > 0) {
					accumulatedData["bids"] = [nextItem[1]["b"][0], nextItem[1]["b"][1]];
					accumulatedData["asks"] = [nextItem[1]["a"][0], nextItem[1]["a"][1]];
				}
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);

let channelId = {}
export const bitfinexSocketSetup = (currencyPair) => {
	return ws_bitfinex$
		.multiplex(
			() => ({ event: "subscribe", channel: "ticker", pair: currencyPair }),
			() => ({ event: "unsubscribe", channel: "ticker", pair: currencyPair }),
			(msg) => {
				if (msg["chanId"] !== undefined) {msg
					channelId[msg["pair"]] = msg["chanId"];
					return false;
				} else if (msg.length === 2 && msg[0] === channelId[currencyPair]) {
					return true;
				} else {
					return false;
				}
			}
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (nextItem.length > 0 && nextItem[1] !== 'hb') {
					accumulatedData["bids"] = [nextItem[1][0], nextItem[1][1]];
					accumulatedData["asks"] = [nextItem[1][2], nextItem[1][3]];
				}
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);
};

export const bybitSocketSetup = (currencyPair) => {
	let bids, asks;
	return ws_bybit$
		.multiplex(
			() => ({ op: "subscribe", args: [`orderBookL2_25.${currencyPair}`] }),
			() => ({ op: "unsubscribe", args: [`orderBookL2_25.${currencyPair}`] }),
			(msg) => {
				return msg["topic"] === `orderBookL2_25.${currencyPair}`;
			}
		)
		.pipe(
			scan((accumulatedData, nextItem) => {
				if (nextItem["type"] === "snapshot") {
					//first recept of snapshot of the orderbook
					bids = nextItem["data"]
						.filter((order) => order["side"] === "Buy")
						.slice(0, 20);
					asks = nextItem["data"]
						.filter((order) => order["side"] === "Sell")
						.slice(0, 20);

					accumulatedData["bids"] = [ 
                        bids[bids.length - 1]['price'],
						bids[bids.length - 1]['size']/bids[bids.length - 1]['price']
					];
					accumulatedData["asks"] = [
                        asks[0]['price'],
						asks[0]['size']/asks[0]['price']
                    ];
				} else if (
					nextItem["type"] === "delta" &&
					(nextItem["data"]["delete"].length > 0 ||
						nextItem["data"]["insert"].length > 0)
				) {
					if (nextItem["data"]["delete"].length > 0) {
						let sell_side = nextItem["data"]["delete"].filter(
							(order) => order["side"] === "Sell"
						);
						let buy_side = nextItem["data"]["delete"].filter(
							(order) => order["side"] === "Buy"
						);
						sell_side = sell_side.filter(
							(order) => order["price"] === asks[0]["price"]
						);
						buy_side = buy_side.filter(
							(order) => order["price"] === bids[bids.length - 1]["price"]
						);

						sell_side.length > 0 ? asks.shift() : null;
						buy_side.length > 0 ? bids.pop() : null;
					}
					if (nextItem["data"]["insert"].length > 0) {
						let sell_side = nextItem["data"]["insert"].filter(
							(order) => order["side"] === "Sell"
						);
						let buy_side = nextItem["data"]["insert"].filter(
							(order) => order["side"] === "Buy"
						);
						sell_side = sell_side.filter(
							(order) => order["price"] < asks[1]["price"]
						);
						buy_side = buy_side.filter(
							(order) => order["price"] > bids[bids.length - 2]["price"]
						);

						sell_side.length > 0 ? (asks[1] = sell_side[0]) : null;
						buy_side.length > 0 ? (bids[bids.length - 2] = buy_side[0]) : null;
					}
					accumulatedData["bids"] = [
                        bids[bids.length - 1]['price'],
						bids[bids.length - 1]['size']/bids[bids.length - 1]['price']
					];
					accumulatedData["asks"] = [
                        asks[0]['price'],
						asks[0]['size']/asks[0]['price']
                    ];
                    
                };
                
				return accumulatedData;
			}, {}),
			retryWhen((err) => {
				if (window.navigator.onLine) {
					return timer(10000);
				} else {
					return fromEvent(window, "online");
				}
			})
		);
};