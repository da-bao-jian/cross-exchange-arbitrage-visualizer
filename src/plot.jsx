import { ResponsiveSwarmPlot, ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot';
import React, { useRef } from 'react';

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
  };
  return store;
};

const randomeIdGenerator = (token) => (
    token+Math.random().toString()
);

const dataConverter = (exchange, order) => {
    return {
        "id": randomeIdGenerator(exchange),
        "group": exchange,
        "bidPrice": parseFloat(order['bids'][0]),
        "bidSize": parseFloat(order['bids'][1]),
        "askPrice": parseFloat(order['asks'][0]), 
        "askSize": parseFloat(order['asks'][1])
    }
};

export const Plot = (props) => {
    let data;
    let HASH = useRef({'bitstamp':[], 'bitmex':[], 'binance':[],'ftx':[], 'kraken':[], 'coinbase':[], 'bitfinex':[], 'bybit':[]});
    let exchanges = Object.entries(props).filter((e)=>e[1]!==undefined);
    
    if(exchanges.length > 0)//change the code below to accomodate props change; when the state changes from true to false, corresponding array in HASH needs to be changed as well
    {
        exchanges.map((exchange)=>{
            HASH.current[exchange[0]] = queue(HASH.current[exchange[0]], dataConverter(exchange[0], exchange[1][0]), 20);
        });
        debugger
        // HASH.current['binance'] = queue(HASH.current['binance'], dataConverter('binance', binance_orders), 20);
        // HASH.current['ftx'] = queue(HASH.current['ftx'], dataConverter('ftx', ftx_orders), 20);
        // HASH.current['kraken'] = queue(HASH.current['kraken'], dataConverter('kraken', kraken_orders), 20);
        // HASH.current['coinbase'] = queue(HASH.current['coinbase'], dataConverter('coinbase', coinbase_orders), 20);
        // HASH.current['bitfinex'] = queue(HASH.current['bitfinex'], dataConverter('bitfinex', bitfinex_orders), 20);
        // HASH.current['bybit'] = queue(HASH.current['bybit'], dataConverter('bybit', bybit_orders), 20);
        data = Object.values(HASH.current).flat(); 
    };
    
    return(
        <div style={{height: '600px', width: '100%'}}>
            {data !== undefined ?
                <div style={{height:'100%'}}>
                    <ResponsiveSwarmPlotCanvas    
                        data={data}
                        groups={[ 'bitstamp', 'ftx','kraken', 'binance','coinbase','bitfinex','bybit']}
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
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Exchanges',
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Price(USD)',
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
