import React, { useState, useEffect } from 'react';
import OrderBook from './ob';
import './App.scss';
import {bitstampSocketSetup} from './utils/websocket_setups';


const App = () => {
    const [tokenConnections, setTokenConnections] = useState({})
    const _SUPPORTED_CURRENCIES = [];
    let bitstampSocket1 = bitstampSocketSetup('btcusd');



    function createNewOrderbook(){

    };
    return (
        <div>
            <h2>Crypto Order Book </h2>
            <OrderBook bitstampSocket={bitstampSocket1}/>
        </div>
    );
};


export default App;