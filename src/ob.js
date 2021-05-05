import React, { useState, useEffect } from 'react';
import { Observable, timer } from 'rxjs';
import { map, retryWhen, delayWhen, scan } from 'rxjs/operators'
import {ws_bitmex$, ws_bitstamp$} from './utils/websocket_connection';
import {subscribe_bitstamp, subscribe_bitmex} from './utils/websocket_message';



const OrderBook = () => {

  const [bitmex_orders, setbitmex_ordersOrders] = useState([]);
  
  const currencyPair = 'btcusd'
  const currencyPair_bitmex = 'XBTUSD'
  const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);
  
  const [bitstamp_orders, setBitstamp_orders] = useState();
  
  useEffect(()=>{
    ws_bitstamp$
      .pipe(
        scan((accumulatedData, nextItem)=>{
          if(Object.keys(nextItem['data']).length>0){//initialize a hash and setting keys asks and bids with orders on top of both sides
            accumulatedData['bids'] = nextItem['data']['bids'][0];
            accumulatedData['asks'] = nextItem['data']['asks'][0];
          };
          
          return accumulatedData;
        },{}),
        retryWhen((err) => { //error handling: reconnect if online, otherwise wait for internet connection
          if (window.navigator.onLine) {
            return timer(10000);
          } else {
            return Observable.fromEvent(window, 'online');
            };
          })
      )
      .subscribe(
          msg => {
            
            Object.keys(msg).length > 0 ? setBitstamp_orders(() => [msg]) : null
        }
      );
    ws_bitstamp$.next(subscribe_bitstamp(currencyPair));    
    // ws_bitmex$.next(subscribe_bitmex);
    
    return () => {
      ws_bitstamp$.complete();
    };
  },[])
  debugger
  
    

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
d
  return (
    <div>
      <h1>d</h1>
        {bitstamp_orders !== undefined && bitstamp_orders.length > 0 ? 
        <div id='bids'>{bitstamp_orders[0]['bids']}</div> : null}
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