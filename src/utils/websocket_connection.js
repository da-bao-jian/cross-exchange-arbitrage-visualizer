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
            console.log('ftx connetion established')
        }   
    }
});

export const ws_binance$ = webSocket({
    url: 'wss://stream.binance.com:9443/stream?streams=btcusdt/ethusdt', //binance needs combined endpoint for multi token streaming
    openObserver: {
        next: () => {
            console.log('binance connetion established')
        }   
    }
});


export const ws_coinbase$ = webSocket({
    url: 'wss://ws-feed.pro.coinbase.com',
    openObserver: {
        next: () => {
            console.log('coinbase connetion established')
        }   
    }
});


export const ws_kraken$ = webSocket({
    url: 'wss://ws.kraken.com',
    openObserver: {
        next: () => {
            console.log('kraken connetion established')
           
        }   
    }
});

export const ws_bitfinex$ = webSocket({
    url: 'wss://api-pub.bitfinex.com/ws/2',
    openObserver: {
        next: () => {
            console.log('bitfinex connetion established')
        }   
    }
});

export const ws_bybit$ = webSocket({
    url: 'wss://stream.bybit.com/realtime',
    openObserver: {
        next: () => {
            console.log('bybit connetion established')
        }   
    }
});