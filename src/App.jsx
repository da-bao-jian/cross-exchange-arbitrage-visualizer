  
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
import {Dashboard} from './dashboard.jsx';

const App = () => {

    const _SUPPORTED_CURRENCIES = ['BTC', 'ETH','XRP','LTC','Doge','ADA','EOS','Polka'];




    let bitstampSocket1 = bitstampSocketSetup(symbols['bitstamp']['BTC']);
    let  bitmexSocket1 = bitmexSocketSetup(symbols['bitmex']['BTC']);
    let ftxSocket1 = ftxSocketSetup(symbols['ftx']['BTC']);
    let binanceSocket1 = binanceSocketSetup(symbols['binance']['BTC'],1);
    let coinbaseSocket1 = coinbaseSocketSetup(symbols['coinbase']['BTC']);
    let krakenSocket1 = krakenSocketSetup(symbols['kraken']['BTC']);
    let bitfinexSocket1 = bitfinexSocketSetup(symbols['bitfinex']['BTC']);
    let bybitSocket1 = bybitSocketSetup(symbols['bybit']['BTC']);


    
    return (
        <div>
            <h2>Crypto Order Book </h2>
            <div>
                 <OrderBook 
                    bitstampSocket={bitstampSocket1} 
                    bitmexSocket={bitmexSocket1} 
                    ftxSocket={ftxSocket1}
                    binanceSocket={binanceSocket1}
                    coinbaseSocket={coinbaseSocket1}
                    krakenSocket={krakenSocket1}
                    bitfinexSocket={bitfinexSocket1}
                    bybitSocket={bybitSocket1}
            />
            </div>
            <div>
                <Dashboard/>
            </div>
        </div>
    );
};


export default App;