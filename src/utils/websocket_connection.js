import {webSocket} from 'rxjs/webSocket';

export const ws_bitstamp$ = webSocket({
    url: 'wss://ws.bitstamp.net',
    openObserver: {
        next: () => {
            console.log('bitstamp connetion established');
        }
    }
});

export const ws_bitmex$ = webSocket({
    url: 'wss://www.bitmex.com/realtime',
    openObserver: {
        next: () => {
            console.log('bitmex connetion established')
        }   
    }
});

export const setup = () =>{
    debugger
    ws_bitmex$.next({
    op: "subscribe",
    args: ['orderBookL2: XBTUSD'],
    })
}
