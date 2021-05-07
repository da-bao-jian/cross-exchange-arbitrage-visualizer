import {ws_bitmex$, ws_bitstamp$, ws_ftx$} from './websocket_connection';
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
        (msg) => {
            return(
                msg.market === currencyPair && msg.data !== undefined
            )
        }
    ) 
    .pipe(
        scan((accumulatedData, nextItem)=>{
            if(Object.keys(nextItem['data']).length>0){//initialize a hash and setting keys asks and bids with orders on top of both sides
                accumulatedData['bids'] = [nextItem['data']['bid'], nextItem['data']['bidSize']];
                accumulatedData['asks'] = [nextItem['data']['ask'], nextItem['data']['askSize']];
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