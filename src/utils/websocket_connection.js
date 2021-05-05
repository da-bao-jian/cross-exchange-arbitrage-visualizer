import {webSocket} from 'rxjs/webSocket';

export const ws_bitstamp$ = webSocket({
    url: 'wss://ws.bitstamp.net',
    openObserver: {
        next: () => {
            console.log('connetion established');
        }
    }
});

export const ws_bitmex$ = webSocket({
    url: 'wss://www.bitmex.com/realtime',
    openObserver: {
        next: () => {
            console.log('connetion established');
        }
    }
});
  