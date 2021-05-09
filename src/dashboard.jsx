  
import React, { useState, useEffect } from 'react';
import OrderBook from './ob';
import './App.scss';
import {bitstampSocketSetup, 
    bitmexSocketSetup, 
    ftxSocketSetup,
    binanceSocketSetup, 
    coinbaseSocketSetup, 
    krakenSocketSetup, 
    bitfinexSocketSetup,
    bybitSocketSetup} from './utils/websocket_setups';
import {symbols} from './utils/symbols';

export const Dashboard = () => {
d

    const [tokenConnections, setTokenConnections] = useState({})


    function createNewOrderbook(token, binanceId){          

        let bitstampSocket = bitstampSocketSetup(symbols['bitstamp'][token]);
        let bitmexSocket = bitmexSocketSetup(symbols['bitmex'][token]);
        let ftxSocket = ftxSocketSetup(symbols['ftx'][token]);
        let binanceSocket = binanceSocketSetup(symbols['binance'][token],binanceId);
        let coinbaseSocket = coinbaseSocketSetup(symbols['coinbase'][token]);
        let krakenSocket = krakenSocketSetup(symbols['kraken'][token]);
        let bitfinexSocket = bitfinexSocketSetup(symbols['bitfinex'][token]);
        let bybitSocket = bybitSocketSetup(symbols['bybit'][token]);


        setTokenConnections(tokenConnections[token] = [(
            <OrderBook 
                bitstampSocket={bitstampSocket} 
                bitmexSocket={bitmexSocket} 
                ftxSocket={ftxSocket}
                binanceSocket={binanceSocket}
                coinbaseSocket={coinbaseSocket}
                krakenSocket={krakenSocket}
                bitfinexSocket={bitfinexSocket}
                bybitSocket={bybitSocket}
            />
        )]);
        
    };
    
    let obList = Object.values(tokenConnections).length > 0 ? Object.values(tokenConnections).map((ob)=>{
        return (
            <li key={Object.values.length}>
                {ob}
            </li>
        )
    }): null;

    return ( 
        <div>
            <ul>
                {obList}
            </ul>
        </div>
    )


};