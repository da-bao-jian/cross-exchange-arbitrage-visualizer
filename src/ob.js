import React, { useState, useEffect } from 'react';
import {Plot} from './plot.jsx';

let OrderBook = ({bitstampSocket, bitmexSocket, ftxSocket, binanceSocket, coinbaseSocket, krakenSocket, bitfinexSocket, bybitSocket }) => {
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
        msg => {Object.keys(msg).length > 0 ? changeState(() => [msg]) : null},
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
    socketSubscription(bitfinexSocket, setBitfinex_orders)


      
      return () => {
        bitstampSocket.unsubscribe();
        bitmexSocket.unsubscribe();
        ftxSocket.unsubscribe();
        binanceSocket.unsubscribe();
        coinbaseSocket.unsubscribe();
        bitfinexSocket.unsubscribe();
        huobiSocket.unsubscribe();
        bybitSocket.unsubscribe();
      };
  },[]);
    

    
    // const orderRows = (arr) => 
  //   arr &&
  //   arr.map((item, index) => {
      
  //     return(
  //       <tr key={index}>
  //           <td> {item[1]} </td>
  //           <td> {item[0]} </td>
  //       </tr>
  //   )}
  // );
  
  // const orderHead = (title) => (
  //   <thead>
  //     <tr>
  //       <th colSpan="2">{title}</th>
  //     </tr>
  //     <tr>
  //       <th>Amount ({currencyArray[0]})</th>
  //       <th>Price ({currencyArray[1]})</th>
  //     </tr>
  //   </thead>
  // );
  // send the state data to chart component and save data stream in the chart component
  return (
    <div>
      <div>
          <Plot 
            bitstamp_orders={bitstamp_orders} 
            bitmex_orders={bitmex_orders} 
            kraken_orders={kraken_orders} 
            ftx_orders={ftx_orders} 
            binance_orders={binance_orders}
            coinbase_orders={coinbase_orders}
            bitfinex_orders={bitfinex_orders}
            bybit_orders={bybit_orders}
          />
      </div>
      {/* <div>
          <p>Bitstamp</p>
          {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ? 
          <div id='bids'>{bitstamp_orders[0]['bids'][0]}</div> : null}
      </div> */}
      {/* <div>
        <p>Bitmex</p>
          {bitmex_orders !== undefined && bitmex_orders.length > 0 ? 
          <div id='bids'>{bitmex_orders[0]['bids'][0]}</div> : null}
      <div>
        <p>Kraken</p>
          {kraken_orders !== undefined && kraken_orders.length > 0 ? 
          <div id='bids'>{kraken_orders[0]['bids'][0]}</div> : null}
      </div>
      </div>
      <div>
        <p>Ftx</p>
          {ftx_orders !== undefined && ftx_orders.length > 0 ? 
          <div id='bids'>{ftx_orders[0]['bids'][0]}</div> : null}
      </div>
      <div>
        <p>Binance</p>
          {binance_orders !== undefined && binance_orders.length > 0 ? 
          <div id='bids'>{binance_orders[0]['bids'][0]}</div> : null}
      </div>
      <div>
        <p>Coinbase</p>
          {coinbase_orders !== undefined && coinbase_orders.length > 0 ? 
          <div id='bids'>{coinbase_orders[0]['bids'][0]}</div> : null}
      </div>
      <div>
        <p>Bitfinex</p>
          {bitfinex_orders !== undefined && bitfinex_orders.length > 0 ? 
          <div id='bids'>{bitfinex_orders[0]['bids'][0]}</div> : null}
      </div>
      <div>
        <p>Bybit</p>
          {bybit_orders !== undefined && bybit_orders.length > 0 ? 
          <div id='bids'>{bybit_orders[0]['bids'][0]}</div> : null}
      </div> */}




      


    </div>
  //   <div className="order-container">
  //     <table>
  //       {orderHead('Bids')}
  //       <tbody>{orderRows(bitstamp_bids)}</tbody>
  //     </table>
  //     <table>
  //       {orderHead('Asks')}
  //       <tbody>{orderRows(bitstamp_asks)}</tbody>
  //     </table>

  //     <table>
  //       {orderHead('Bids')}
  //       <tbody>{orderRows(bitmex_bids)}</tbody>
  //     </table>

  //     <table>
  //       {orderHead('Asks')}
  //       <tbody>{orderRows(bitmex_asks)}</tbody>
  //     </table>
  );
};

export default OrderBook;