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

export const ws_ftx$ = webSocket({
    url: 'wss://ftx.com/ws/',
    openObserver: {
        next: () => {
            console.log('bitmex connetion established')
        }   
    }
});