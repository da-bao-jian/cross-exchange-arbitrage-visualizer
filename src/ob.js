import React, { useState, useEffect } from 'react';
import {Plot} from './plot.jsx';

let OrderBook = ({token, bitstampSocket, bitmexSocket, ftxSocket, binanceSocket, coinbaseSocket, krakenSocket, bitfinexSocket, bybitSocket }) => {
  let [bitstamp_orders, setBitstamp_orders] = useState();
  let [bitmex_orders, setBitmex_orders] = useState();
  let [ftx_orders, setFtx_orders] = useState();
  let [binance_orders, setBinance_orders] = useState(); 
  let [coinbase_orders, setCoinbase_orders] = useState(); 
  let [kraken_orders, setKraken_orders] = useState();
  let [bitfinex_orders, setBitfinex_orders] = useState();
  let [bybit_orders, setBybit_orders] = useState();

  function socketSubscription(socket, changeState){
    setTimeout(() => {
      socket.subscribe(
        msg => {
          Object.keys(msg).length > 0 ? changeState(() => [msg]) : null},
        err => {console.log(err)}
      )
    }, 1000);
  };

  useEffect(()=>{
    socketSubscription(bitstampSocket, setBitstamp_orders);
    // socketSubscription(bitmexSocket, setBitmex_orders);
    socketSubscription(ftxSocket, setFtx_orders);
    socketSubscription(binanceSocket, setBinance_orders);
    socketSubscription(coinbaseSocket, setCoinbase_orders);
    socketSubscription(krakenSocket, setKraken_orders);
    socketSubscription(bybitSocket, setBybit_orders);
    socketSubscription(bitfinexSocket, setBitfinex_orders);

    return () => {
      bitstampSocket.unsubscribe();
      // bitmexSocket.unsubscribe();
      ftxSocket.unsubscribe();
      binanceSocket.unsubscribe();
      coinbaseSocket.unsubscribe();
      bitfinexSocket.unsubscribe();
      huobiSocket.unsubscribe();
      bybitSocket.unsubscribe();
    };
  },[]);


  const orderHead = (title) => (
    <thead>
      <tr>
        <th colSpan="2">{title}</th>
      </tr>
      <tr>
        <th>Price (USD)</th>
        <th>Size ({token})</th>
      </tr>
    </thead>
  );

  return (
    <div>
      <div className='container'>
        <div className='plot'>
            <Plot 
              bitstamp_orders={bitstamp_orders} 
              // bitmex_orders={bitmex_orders} 
              kraken_orders={kraken_orders} 
              ftx_orders={ftx_orders} 
              binance_orders={binance_orders}
              coinbase_orders={coinbase_orders}
              bitfinex_orders={bitfinex_orders}
              bybit_orders={bybit_orders}
            />
        </div>
        <div className="order-container">
          <table>
            <thead>
              <tr>
                <th colSpan="2">{token}</th>
              </tr>
              <tr>
                <th className='exchange-header'>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr key='bitstamp'>
                <td>
                  Bitstamp
                </td>
              </tr>
              <tr key='ftx'>
                <td>
                FTX
                </td>
              </tr>
              <tr key='kraken'>
                <td>
                Kraken
                </td>
              </tr>
              <tr key='coinbase'>
                <td>
                Coinbase
                </td>
              </tr>              
              <tr key='binance'>
                <td>
                Binance
                </td>
              </tr>
              <tr key='bitfinex'>
                <td>
                Bitfinex
                </td>
              </tr>
              <tr key='bybit'>
                <td>
                Bybit
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            {orderHead('Bids')}
            <tbody>
              <tr key='bitstamp'>
                  {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ?  
                  <>
                    <td id='bids'>{bitstamp_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{bitstamp_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='ftx'>
                  {ftx_orders !== undefined && ftx_orders.length > 0 ?  
                  <>
                    <td id='bids'>{ftx_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{ftx_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='kraken'>
                  {kraken_orders !== undefined && kraken_orders.length > 0 ?  
                  <>
                    <td id='bids'>{kraken_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{kraken_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='coinbase'>
                  {coinbase_orders !== undefined && coinbase_orders.length > 0 ?  
                  <>
                    <td id='bids'>{coinbase_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{coinbase_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='binance'>
                  {binance_orders !== undefined && binance_orders.length > 0 ?  
                  <>
                    <td id='bids'>{binance_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{binance_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             
              <tr key='bitfinex'>
                  {bitfinex_orders !== undefined && bitfinex_orders.length > 0 ?  
                  <>
                    <td id='bids'>{bitfinex_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{bitfinex_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='bybit'>
                  {bybit_orders !== undefined && bybit_orders.length > 0 ?  
                  <>
                    <td id='bids'>{bybit_orders[0]['bids'][0].toFixed(2)}</td> 
                    <td id='bids'>{bybit_orders[0]['bids'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             
            </tbody>
          </table>
          <table>
            {orderHead('Asks')}
            <tbody>
              <tr key='bitstamp'>
                  {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ?  
                  <>
                    <td id='asks'>{bitstamp_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{bitstamp_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='ftx'>
                  {ftx_orders !== undefined && ftx_orders.length > 0 ?  
                  <>
                    <td id='asks'>{ftx_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{ftx_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='kraken'>
                  {kraken_orders !== undefined && kraken_orders.length > 0 ?  
                  <>
                    <td id='asks'>{kraken_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{kraken_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='coinbase'>
                  {coinbase_orders !== undefined && coinbase_orders.length > 0 ?  
                  <>
                    <td id='asks'>{coinbase_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{coinbase_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='binance'>
                  {binance_orders !== undefined && binance_orders.length > 0 ?  
                  <>
                    <td id='asks'>{binance_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{binance_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             
              <tr key='bitfinex'>
                  {bitfinex_orders !== undefined && bitfinex_orders.length > 0 ?  
                  <>
                    <td id='asks'>{bitfinex_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{bitfinex_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             

              <tr key='bybit'>
                  {bybit_orders !== undefined && bybit_orders.length > 0 ?  
                  <>
                    <td id='asks'>{bybit_orders[0]['asks'][0].toFixed(2)}</td> 
                    <td id='asks'>{bybit_orders[0]['asks'][1].toFixed(2)}</td> 
                  </>
                    : null}
              </tr>             
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;