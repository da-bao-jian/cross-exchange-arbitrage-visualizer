import { ws_bitmex$, ws_bitstamp$, ws_ftx$, ws_binance$, ws_coinbase$, ws_kraken$, ws_bitfinex$} from './websocket_connection';
import { retryWhen, scan, map } from 'rxjs/operators';
import { timer } from 'rxjs';

export const bitstampSocketSetup = (currencyPair) => (
    ws_bitstamp$
    .multiplex(
        () => ({event: 'bts:subscribe', data: {channel: `order_book_${currencyPair}`}}),
        () => ({event: 'bts:unsubscribe', data: {channel: `order_book_${currencyPair}`}}),
        (msg) => (msg.channel === `order_book_${currencyPair}`)
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
        if(Object.keys(nextItem['data']).length>0){//initialize a hash and setting keys asks and bids with orders on top of both sides
            accumulatedData['bids'] = nextItem['data']['bids'][0];
            accumulatedData['asks'] = nextItem['data']['asks'][0];
        };
        return accumulatedData;
        },{}),
        retryWhen((err) => { //error handling: reconnect if online, otherwise wait for internet connection
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
);

export const bitmexSocketSetup = (currencyPair) => (
    ws_bitmex$
    .multiplex(
        () => ({op: "subscribe", args: [`quote:${currencyPair}`]}),
        () => ({op: "unsubscribe", args: [`quote:${currencyPair}`]}),
        (msg) => {
            if(msg['data'] !== undefined && msg['data'].length > 0) {
                return msg['data'][0]['symbol'] === currencyPair;            
            } else {
                return false;
            };
        }
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
            accumulatedData['bids'] = [nextItem['data'][0]['bidPrice'], nextItem['data'][0]['bidSize']/nextItem['data'][0]['bidPrice']]; //on Bitmex, size 1 = 1USD so size/price denotes unit number of 'token' on the book
            accumulatedData['asks'] = [nextItem['data'][0]['askPrice'], nextItem['data'][0]['askSize']/nextItem['data'][0]['askPrice']];
            return accumulatedData;
        },{}),
        retryWhen((err) => {
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
);

export const ftxSocketSetup = (currencyPair) => (
    ws_ftx$
    .multiplex(
        () => ({'op': 'subscribe', 'channel': 'ticker', 'market': currencyPair}),
        () => ({'op': 'unsubscribe', 'channel': 'ticker', 'market': currencyPair}),
        (msg) => (msg.market === currencyPair && msg.data !== undefined)
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
            if(Object.keys(nextItem['data']).length>0){
                accumulatedData['bids'] = [nextItem['data']['bid'], nextItem['data']['bidSize']];
                accumulatedData['asks'] = [nextItem['data']['ask'], nextItem['data']['askSize']];
            };
            return accumulatedData;
        },{}),
        retryWhen((err) => { 
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
);

export const binanceSocketSetup = (currencyPair, id) => (//binance requires an unique id
    ws_binance$ 
    .multiplex(
        () => ({method: "SUBSCRIBE",params:[`${currencyPair}@bookTicker`],id:id}),
        () => ({method: "UNSUBSCRIBE",params:[`${currencyPair}@bookTicker`],id:id}),
        (msg) => {
            return(msg.stream === `${currencyPair}@bookTicker`)}
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
            if(Object.keys(nextItem['data']).length>0){
                accumulatedData['bids'] = [nextItem['data']['b'], nextItem['data']['B']];
                accumulatedData['asks'] = [nextItem['data']['a'], nextItem['data']['A']];
            };
            return accumulatedData;
        },{}),
        retryWhen((err) => { 
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
);

// coinbase's ticker channel don't provide volume for best bid/ask price, therefore it subscribes to level2 book channel to extrapolate the data
export const coinbaseSocketSetup = (currencyPair) => {
    let bids, asks, storage;
    return ws_coinbase$
    .multiplex(
        () => ({"type": "subscribe",
                "product_ids": [currencyPair],
                "channels": ["level2"]
                }), 
        () => ({"type": "unsubscribe",
                "product_ids": [currencyPair],
                "channels": ["ticker"]
                }), 
        (msg) => {
            return(msg.product_id === currencyPair)}
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
            if(nextItem['type'] === "snapshot"){//first recept of snapshot of the orderbook
                bids = nextItem['bids'].slice(0,20);
                asks = nextItem['asks'].slice(0,20);
                
                accumulatedData['bids'] = [bids[0][0], bids[0][1]];
                accumulatedData['asks'] = [asks[0][0], asks[0][1]];
            } else if (nextItem['type'] === "l2update"){
                if(nextItem['changes'][0][0] === 'buy'){
                    if(nextItem['changes'][0][2] === "0.00000000"){
                        bids = bids.filter((order)=>(order[0] !== nextItem['changes'][0][1]));
                    } else if(nextItem['changes'][0][2] !== "0.00000000"){
                        if(bids.map((price)=>price[0]).indexOf(nextItem['changes'][0][1]) !== -1){
                            bids[bids.map((price)=>price[0]).indexOf(nextItem['changes'][0][1])] = [nextItem['changes'][0][1], nextItem['changes'][0][2]]
                        }
                        else {
                            
                            for(let i=0; i<bids.length;i++){
                                if(nextItem['changes'][0][1]>bids[i][0]){
                                    storage = bids.splice(0,i-1,[nextItem['changes'][0][1], nextItem['changes'][0][2]]);
                                    bids = storage.concat(bids);
                                }
                            };
                        };
                    };
                } else if(nextItem['changes'][0][0] === 'sell'){
                    if(nextItem['changes'][0][2] === "0.00000000"){
                        asks = asks.filter((order)=>(order[0] !== nextItem['changes'][0][1]));
                    } else if(nextItem['changes'][0][2] !== "0.00000000"){
                        if(asks.map((price)=>price[0]).indexOf(nextItem['changes'][0][1]) !== -1){
                            asks[asks.map((price)=>price[0]).indexOf(nextItem['changes'][0][1])] = [nextItem['changes'][0][1], nextItem['changes'][0][2]]
                        }
                        else {
                            
                            for(let i=0; i<asks.length;i++){
                                if(nextItem['changes'][0][1]<asks[i][0]){
                                    storage = asks.splice(0,i-1,[nextItem['changes'][0][1], nextItem['changes'][0][2]]);
                                    asks = storage.concat(asks);
                                }
                            };
                        }
                    }
                }
                debugger
                accumulatedData['bids'] = [bids[0][0], bids[0][1]];
                accumulatedData['asks'] = [asks[0][0], asks[0][1]];
                
            };
            return accumulatedData;
        },{}),
        retryWhen((err) => { 
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
};

export const krakenSocketSetup = (currencyPair) => (
    ws_kraken$ 
    .multiplex(
        () => ({'event': "subscribe",'pair':[currencyPair],'subscription':{'name':'ticker'}}),
        () => ({'event': "unsubscribe",'pair':[currencyPair],'subscription':{'name':'ticker'}}),
        (msg) => {
            return(msg[3] === currencyPair)}
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{debugger
            if(nextItem.length>0){
                accumulatedData['bids'] = [nextItem[1]['b'][0], nextItem[1]['b'][1]];
                accumulatedData['asks'] = [nextItem[1]['a'][0], nextItem[1]['a'][1]];
            };
            return accumulatedData;
        },{}),
        retryWhen((err) => { 
            if (window.navigator.onLine) {
                return timer(10000);
            } else {
                return fromEvent(window, 'online');
            };
        })
    )
);