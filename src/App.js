import React, { useState, useEffect } from 'react';
import OrderBook from './ob';
import './App.scss';
import {bitstampSocketSetup, bitmexSocketSetup} from './utils/websocket_setups';
import {tickers} from './utils/tickers';
const App = () => {
    const [tokenConnections, setTokenConnections] = useState({})
    const _SUPPORTED_CURRENCIES = [];

    let bitstampSocket1 = bitstampSocketSetup(tickers['bitstamp']['BTC']);
    let bitmexSocket1 = bitmexSocketSetup(tickers['bitmex']['BTC']);
    

    function createNewOrderbook(){

    };

    return (
        <div>
            <h2>Crypto Order Book </h2>
            <OrderBook bitstampSocket={bitstampSocket1} bitmexSocket={bitmexSocket1}/>
        </div>
    );
};


export default App;