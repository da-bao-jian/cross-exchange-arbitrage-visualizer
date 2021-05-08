import React, { useState, useEffect } from 'react';


let OrderBook = ({bitstampSocket, bitmexSocket, ftxSocket, binanceSocket, coinbaseSocket, krakenSocket, bitfinexSocket, bybitSocket}) => {

  let [bitstamp_orders, setBitstamp_orders] = useState();
  let [bitmex_orders, setBitmex_orders] = useState();
  let [ftx_orders, setFtx_orders] = useState();
  let [binance_orders, setBinance_orders] = useState(); 
  let [coinbase_orders, setCoinbase_orders] = useState(); 
  let [kraken_orders, setKraken_orders] = useState();
  let [bitfinex_orders, setBitfinex_orders] = useState();
  let [bybitSocket_orders, setBybitSocket] = useState();

  function socketSubscription(socket, changeState){
    setTimeout(() => (
      socket.subscribe(
        msg => {Object.keys(msg).length > 0 ? changeState(() => [msg]) : null},
        err => {console.log(err)}
      )
    ), 1000)
  };
    
  useEffect(()=>{
    socketSubscription(bitstampSocket, setBitstamp_orders);
    socketSubscription(bitmexSocket, setBitmex_orders);
    socketSubscription(ftxSocket, setFtx_orders);
    socketSubscription(binanceSocket, setBinance_orders);
    socketSubscription(coinbaseSocket, setCoinbase_orders);
    socketSubscription(krakenSocket, setKraken_orders);
    socketSubscription(bybitSocket, setBybitSocket);

    bitfinexSocket.subscribe(
      msg => {Object.keys(msg).length > 0 ? setBitfinex_orders(() => [msg]) : null},
      err => {console.log(err)}
    )


    return () => {
      bitstampSocket.unsubscribe();
      bitmexSocket.unsubscribe();
      ftxSocket.unsubscribe();
      binanceSocket.unsubscribe();
      coinbaseSocket.unsubscribe();
      bitfinexSocket.unsubscribe();
      huobiSocket.unsubscribe();
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
    <div>
      <div>
          {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ? 
          <div id='bids'>{bitstamp_orders[0]['bids']}</div> : null}
      </div>
      <div>
          {bitmex_orders !== undefined && bitmex_orders.length > 0 ? 
          <div id='bids'>{bitmex_orders[0]['bids']}</div> : null}
      </div>
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



  //   </div>
  );
};

export default OrderBook;
