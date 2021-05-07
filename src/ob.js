import React, { useState, useEffect } from 'react';
import { Observable, timer } from 'rxjs';
import { map, retryWhen, delayWhen, scan } from 'rxjs/operators'
import {ws_bitmex$, ws_bitstamp$} from './utils/websocket_connection';
import {subscribe_bitstamp, subscribe_bitmex} from './utils/websocket_message';
import {bitstampSocketSetup} from './utils/websocket_setups';
import {setup} from './utils/websocket_connection';

const OrderBook = ({bitstampSocket, bitmexSocket}) => {

  const [bitstamp_orders, setBitstamp_orders] = useState();
  const [bitmex_orders, setBitmex_orders] = useState();
    
  useEffect(()=>{
    bitstampSocket.subscribe(
      msg => {Object.keys(msg).length > 0 ? setBitstamp_orders(() => [msg]) : null},
      err => {console.log(err)}
    );
    bitmexSocket.subscribe(
      msg => {  
        Object.keys(msg).length > 0 ? setBitmex_orders(() => [msg]) : null},
      err => {console.log(err)}
    );


    return () => {
      bitstampSocket.unsubscribe();
      bitmexSocket.unsubscribe();
    };
  },[]);
  
  
  

    // ws_bitmex$.subscribe(msg => {
    //   Object.keys(msg).length > 0 ? setBitstamp_orders(() => [msg]) : null;
    // });
    
  
  
  
        




        

//   if(response['data'] && response['data'].length > 0){
  
//     const sell_side = response['data'].filter(i=>(i['side'] === 'Sell'));
//     const buy_side = response['data'].filter(i=>(i['side'] === 'Sell'));
//     const sell_price_volume_arr = sell_side.map(i=>([i['price'],i['size']]));
//     const buy_price_volume_arr = buy_side.map(i=>([i['price'],i['size']]));
//     const result = {'bids':buy_price_volume_arr, 'asks':sell_price_volume_arr};
//     setbitmex_ordersOrders(result);
//   }
// };

  // const bitstamp_bids = bitstamp_orders['bids']
  // const bitstamp_asks = bitstamp_orders['asks']

  // const bitmex_bids = bitmex_orders['bids'] 
  // const bitmex_asks = bitmex_orders['asks']
  // // const { bids, asks } = bitstamp_orders; 
  // // bids, asks: [[price, volume]]
  
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
