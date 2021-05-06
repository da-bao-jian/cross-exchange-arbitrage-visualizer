import {ws_bitmex$, ws_bitstamp$} from './websocket_connection';
import { retryWhen, scan } from 'rxjs/operators';
import { timer } from 'rxjs';



export const bitstampSocketSetup = (currencyPair) => (
    ws_bitstamp$
    .multiplex(
        () => ({event: 'bts:subscribe', data: {channel: `order_book_${currencyPair}`}}),
        () => ({event: 'bts:unsubscribe', data: {channel: `order_book_${currencyPair}`}}),
        (msg) => msg.channel === `order_book_${currencyPair}`
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