
import React, { useState, useEffect } from 'react';

const queue = (store, ele, capacity) => {
  if(Object.keys(store).length >= capacity){
    delete store[Object.keys(store)[0]]
  };
  let tail = Object.keys(store).length>0 ? Object.keys(store)[Object.keys(store).length-1] : -1;
  tail = parseInt(tail)
  store[tail+1] = ele;
  return store;
};


let OrderBook = ({bitstampSocket, bitmexSocket, ftxSocket, binanceSocket, coinbaseSocket, krakenSocket, bitfinexSocket, bybitSocket }) => {
  let [bitstamp_orders, setBitstamp_orders] = useState({});
  let [bitmex_orders, setBitmex_orders] = useState({});
  let [ftx_orders, setFtx_orders] = useState({});
  let [binance_orders, setBinance_orders] = useState({}); 
  let [coinbase_orders, setCoinbase_orders] = useState({}); 
  let [kraken_orders, setKraken_orders] = useState({});
  let [bitfinex_orders, setBitfinex_orders] = useState({});
  let [bybit_orders, setBybit_orders] = useState({});
  
  function socketSubscription(socket, changeState){
    setTimeout(() => {
      socket.subscribe(
        msg => {Object.keys(msg).length > 0 ? changeState((oldData) => queue(oldData, msg, 20)) : null},
        err => {console.log(err)}
      )
    }, 1000);
  };
    
  useEffect(()=>{
    socketSubscription(bitstampSocket, setBitstamp_orders);
    socketSubscription(bitmexSocket, setBitmex_orders);
    socketSubscription(ftxSocket, setFtx_orders);
    socketSubscription(binanceSocket, setBinance_orders);
    socketSubscription(coinbaseSocket, setCoinbase_orders);
    socketSubscription(krakenSocket, setKraken_orders);
    socketSubscription(bybitSocket, setBybit_orders);
    socketSubscription(bitfinexSocket, setBitfinex_orders)
    // bitfinexSocket.subscribe(
    //   msg => {Object.keys(msg).length > 0 ? setBitfinex_orders((oldData) => {
    //     return queue(oldData, msg, 20)}) : null},
    //   err => {console.log(err)}
    // );
        
      
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

  return (
    // <div>
      <div>
          <p>Bitstamp</p>
          {/* {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ? 
          <div id='bids'>{bitstamp_orders[0]['bids'][0]}</div> : null} */}
      </div>
    //   <div>
    //     <p>Bitmex</p>
    //       {bitmex_orders !== undefined && bitmex_orders.length > 0 ? 
    //       <div id='bids'>{bitmex_orders[0]['bids'][0]}</div> : null}
    //   <div>
    //     <p>Kraken</p>
    //       {kraken_orders !== undefined && kraken_orders.length > 0 ? 
    //       <div id='bids'>{kraken_orders[0]['bids'][0]}</div> : null}
    //   </div>
    //   </div>
    //   <div>
    //     <p>Ftx</p>
    //       {ftx_orders !== undefined && ftx_orders.length > 0 ? 
    //       <div id='bids'>{ftx_orders[0]['bids'][0]}</div> : null}
    //   </div>
    //   <div>
    //     <p>Binance</p>
    //       {binance_orders !== undefined && binance_orders.length > 0 ? 
    //       <div id='bids'>{binance_orders[0]['bids'][0]}</div> : null}
    //   </div>
    //   <div>
    //     <p>Coinbase</p>
    //       {coinbase_orders !== undefined && coinbase_orders.length > 0 ? 
    //       <div id='bids'>{coinbase_orders[0]['bids'][0]}</div> : null}
    //   </div>
    //   <div>
    //     <p>Bitfinex</p>
    //       {bitfinex_orders !== undefined && bitfinex_orders.length > 0 ? 
    //       <div id='bids'>{bitfinex_orders[0]['bids'][0]}</div> : null}
    //   </div>
    //   <div>
    //     <p>Bybit</p>
    //       {bybit_orders !== undefined && bybit_orders.length > 0 ? 
    //       <div id='bids'>{bybit_orders[0]['bids'][0]}</div> : null}
    //   </div>




      


    // </div>
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