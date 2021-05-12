import { ResponsiveSwarmPlot   } from '@nivo/swarmplot';
import React, { useState, useEffect } from 'react';

const queue = (store, ele, capacity) => {
  if(store.length >= capacity){
    store.shift()
  };
  if(!store.map((order)=>(order['askPrice'])).includes(ele['askPrice']) ||    
    !store.map((order)=>(order['bidPrice'])).includes(ele['bidPrice'])||
    !store.map((order)=>(order['bidSize'])).includes(ele['bidSize'])||
    !store.map((order)=>(order['askSize'])).includes(ele['askSize'])
  ){
    store.push(ele)
  }
  
  return store;
};

const randomeIdGenerator = (token) => (
    token+Math.random().toString()
);

const dataConverter = (exchange, order) => {
    return {
        "id": randomeIdGenerator(exchange),
        "group": exchange,
        "bidPrice": parseFloat(order[0]['bids'][0]),
        "bidSize": parseFloat(order[0]['bids'][1]),
        "askPrice": parseFloat(order[0]['asks'][0]), 
        "askSize": parseFloat(order[0]['asks'][1])
    }
};

let HASH = {'bitstamp':[], 'bitmex':[], 'binance':[],'ftx':[], 'kraken':[], 'coinbase':[], 'bitfinex':[], 'bybit':[]};
let data=[];
export const Plot = ({bitstamp_orders, bitmex_orders, binance_orders, kraken_orders, ftx_orders, coinbase_orders, bitfinex_orders, bybit_orders}) => {
    
    if(bitstamp_orders !== undefined && binance_orders!== undefined && ftx_orders!==undefined && kraken_orders!==undefined && coinbase_orders!==undefined && bitfinex_orders!==undefined && bybit_orders!== undefined)
    {
       HASH['bitstamp'] = queue(HASH['bitstamp'], dataConverter('bitstamp', bitstamp_orders), 20);
       HASH['binance'] = queue(HASH['binance'], dataConverter('binance', binance_orders), 20);
       HASH['ftx'] = queue(HASH['ftx'], dataConverter('ftx', ftx_orders), 20);
       HASH['kraken'] = queue(HASH['kraken'], dataConverter('kraken', kraken_orders), 20);
       HASH['coinbase'] = queue(HASH['coinbase'], dataConverter('coinbase', coinbase_orders), 20);
       HASH['bitfinex'] = queue(HASH['bitfinex'], dataConverter('bitfinex', bitfinex_orders), 20);
       HASH['bybit'] = queue(HASH['bybit'], dataConverter('bybit', bybit_orders), 20);
       debugger
       data = Object.values(HASH).flat(); 
    };
    
    return(
        <div style={{height: '600px'}}>
            {data.length > 0 ?
                <div style={{height:'100%'}}>
                    <ResponsiveSwarmPlot   
                        data={data}
                        groups={[ 'bitstamp', 'ftx','kraken','coinbase','bitfinex','bybit', 'binance']}
                        value="bidPrice"
                        valueFormat="$.2f"
                        valueScale={{ type: 'linear', min: Math.min(...data.map(m=>m['bidPrice']))-20 , max: Math.max(...data.map(m=>m['bidPrice']))+20, reverse: false }}
                        size={{ key: 'bidSize', values: [ 4, 20 ], sizes: [ 24, 80 ] }}
                        gap={33}
                        spacing={8}
                        forceStrength={4}
                        simulationIterations={260}
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.6
                                ],
                                [
                                    'opacity',
                                    0.5
                                ]
                            ]
                        }}
                        margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
                        axisTop={{
                            orient: 'top',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'group if vertical, price if horizontal',
                            legendPosition: 'middle',
                            legendOffset: -46
                        }}
                        axisRight={{
                            orient: 'right',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'price if vertical, group if horizontal',
                            legendPosition: 'middle',
                            legendOffset: 76
                        }}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'group if vertical, price if horizontal',
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'price if vertical, group if horizontal',
                            legendPosition: 'middle',
                            legendOffset: -76
                        }}
                        motionStiffness={50}
                        motionDamping={10}
                    />
                </div>
            : null}
        </div>
    )

};