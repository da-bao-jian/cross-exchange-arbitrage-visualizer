import React, { useState, useEffect } from 'react';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { map, tap, retryWhen, delayWhen, scan } from 'rxjs/operators'

const OrderBook = () => {

  const [bitstamp_orders, setbitstamp_ordersOrders] = useState([]);
  const [bitmex_orders, setbitmex_ordersOrders] = useState([]);
  
  // not needed since a list will be provided
  const currencyPair = 'btcusd'
  const currencyPair_bitmex = 'XBTUSD'
  const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);

  useEffect(() => {

    const subscribe_bitstamp = {
      event: 'bts:subscribe',
      data: {
        channel: `order_book_${currencyPair}`
      }
    };
    const subscribe_bitmex = {
        op: "subscribe",
        args: [`orderBookL2:${currencyPair_bitmex}`],
    };


    const ws_bitstamp = webSocket({
      url: 'wss://ws.bitstamp.net',
      openObserver: {
        next: () => {
            console.log('connetion established');
        }
      }
    })

    const ws_bitmex = webSocket({
        url: 'wss://www.bitmex.com/realtime',
        openObserver: {
          next: () => {
            console.log('connetion established');
          }
        }
      });
      
      // const observer = ws_bitmex.subscribe(
        // msg => {
      //     debugger
      //     return(console.log('message received: ' + msg))
      //   });
      // ws_bitmex.next(subscribe_bitmex)
    ws_bitstamp
    .pipe(
      scan((accumulatedData, nextItem)=>{
        if(Object.keys(nextItem['data']).length>0){
          accumulatedData['bids'] = nextItem['data']['bids'][0];
          accumulatedData['asks'] = nextItem['data']['asks'][0];
        };
        return accumulatedData;
      },{}),
      retryWhen((err) => { //error handling: reconnect if online, otherwise wait for internet connection
        if (window.navigator.onLine) {
          return Observable.timer(10000);
        } else {
          return Observable.fromEvent(window, 'online');
          };
        })
    )
    .subscribe(
      msg => {
        debugger
        return(
          Object.keys(msg).length > 0 ? setbitstamp_ordersOrders(msg) : console.log(msg['event'])
        )
      }
    )
    ws_bitstamp.next(subscribe_bitstamp)

  //   ws_bitstamp.onopen = () => {
  //     ws_bitstamp.send(JSON.stringify(subscribe_bitstamp));
  //   };
  //   ws_bitmex.onopen = () => {
  //     ws_bitmex.send(JSON.stringify(subscribe_bitmex));
  //   };


    // ws_bitstamp.onmessage = (event) => {
    //   const response = JSON.parse(event.data);
      
    //   setbitstamp_ordersOrders(response.data);
    // };
    // ws_bitmex.onmessage = (event) => {
    //   const response = JSON.parse(event.data);
      
    //   if(response['data'] && response['data'].length > 0){
      
    //     const sell_side = response['data'].filter(i=>(i['side'] === 'Sell'));
    //     const buy_side = response['data'].filter(i=>(i['side'] === 'Sell'));
    //     const sell_price_volume_arr = sell_side.map(i=>([i['price'],i['size']]));
    //     const buy_price_volume_arr = buy_side.map(i=>([i['price'],i['size']]));
    //     const result = {'bids':buy_price_volume_arr, 'asks':sell_price_volume_arr};
    //     setbitmex_ordersOrders(result);
    //   }
    // };


  //   ws_bitstamp.onclose = () => {
  //     ws_bitstamp.close();
  //   };
  //   ws_bitmex.onclose = () => {
  //     ws_bitmex.close();
  //   };

    return () => {
      ws_bitstamp.complete();
      ws_bitmex.complete();
    };
  }, []);


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
    <div>{bitmex_orders}</div>
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
