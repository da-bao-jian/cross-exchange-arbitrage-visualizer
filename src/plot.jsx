import { ResponsiveSwarmPlot, ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot';
import React, { useRef, useState, useEffect } from 'react';

const queue = (store, ele, capacity) => {
  if(store.length >= capacity){
    store.shift()
  };
  if(!store.map((order)=>(order['Price'])).includes(ele['Price']) ||    
    !store.map((order)=>(order['Size'])).includes(ele['Size'])
  ){
    store.push(ele)
  };
  return store;
};

const idGenerator = (token) => (
    token+Math.random().toString()
);

const dataConverter = (exchange, order, side) => {
    return {
        "id": idGenerator(exchange),
        "group": exchange,
        "side": side,
        "Price": parseFloat(order[0]),
        "Size": parseFloat(order[1]),
    };
};

export const Plot = (props) => {
    let data, bidData, askData;
    let bidHash = useRef({'bitstamp':[], 'bitmex':[], 'binance':[],'ftx':[], 'kraken':[], 'coinbase':[], 'bitfinex':[], 'bybit':[]});
    let askHash = useRef({'bitstamp':[], 'bitmex':[], 'binance':[],'ftx':[], 'kraken':[], 'coinbase':[], 'bitfinex':[], 'bybit':[]});
    let exchanges = Object.entries(props).filter((e)=> (e[1]!==undefined));
    let displayList = Object.keys(props).filter((e)=>(props[e]!==undefined));

    if(exchanges.length > 0){
        exchanges.map((exchange)=>(bidHash.current[exchange[0]] = queue(bidHash.current[exchange[0]], dataConverter(exchange[0], exchange[1][0]['bids'], 'bid'), 3)));
        exchanges.map((exchange)=>(askHash.current[exchange[0]] = queue(askHash.current[exchange[0]], dataConverter(exchange[0], exchange[1][0]['asks'], 'ask'), 3)));
        bidData = Object.values(bidHash.current).filter(e=>(e[0]!==undefined && displayList.includes(e[0]['group']))).flat();
        askData = Object.values(askHash.current).filter(e=>(e[0]!==undefined && displayList.includes(e[0]['group']))).flat();
        data = bidData.concat(askData);
        
    };

    return(
        <div style={{height: '600px', width: '100%'}}>
            {data !== undefined ?
                <div style={{height:'60%'}}>
                    <div style={{height:'100%', width:'100%'}}>
                        <ResponsiveSwarmPlotCanvas
                            data={data}
                            groups={displayList}
                            label='Size'
                            value="Price"
                            valueFormat="$.2f"
                            valueScale={{ type: 'linear', min: Math.min(...bidData.map(m=>m['Price']))-5 , max: Math.max(...askData.map(m=>m['Price']))+5, reverse: false }}
                            size={{ key: 'Size', values: [ 4, 20 ], sizes: [ 24, 80 ] }}
                            gap={33}
                            colorBy={({data})=>(data['side'])}
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
                            margin={{ top: 80, right: 100, bottom: 0, left: 100 }}
                            // axisTop={{
                            //     orient: 'top',
                            //     tickSize: 10,
                            //     tickPadding: 5,
                            //     tickRotation: 0,
                            //     legend: 'Ask Price(USD)',
                            //     legendPosition: 'middle',
                            //     legendOffset: 46
                            // }}
                            motionStiffness={50}
                            motionDamping={10}
                        />
                    </div>
                </div>
            : null}
        </div>
    )
};
