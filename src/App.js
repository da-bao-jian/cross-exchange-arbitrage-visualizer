import React, { useState, useEffect } from 'react';
import OrderBook from './ob';
import './App.scss';
import {bitstampSocketSetup, bitmexSocketSetup, ftxSocketSetup} from './utils/websocket_setups';
import {tickers} from './utils/tickers';

const App = () => {
    const [tokenConnections, setTokenConnections] = useState({})
    const _SUPPORTED_CURRENCIES = ['BTC', 'ETH','XRP','LTC','Doge','ADA','EOS','Polka'];
    const exchanges = ['binance','bitmex','ftx','coinbase','kraken','bitstamp','bitfinex','okex','gemini','huobi'];

    let bitstampSocket1 = bitstampSocketSetup(tickers['bitstamp']['BTC']);
    let bitmexSocket1 = bitmexSocketSetup(tickers['bitmex']['BTC']);
    let ftxSocket1 = ftxSocketSetup(tickers['ftx']['BTC']);

    function createNewOrderbook(){

    };

    return (
        <div>
            <h2>Crypto Order Book </h2>
            <OrderBook bitstampSocket={bitstampSocket1} bitmexSocket={bitmexSocket1} ftxSocket={ftxSocket1}/>
        </div>
    );
};


export default App;