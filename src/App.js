import React from 'react';
import OrderBook from './ob';
import Searchbar from './searchbar';
import './App.scss'

const App = () => {
    const _SUPPORTED_CURRENCIES = [];

    return (
        <div>
            <h2>Crypto Order Book </h2>
            <Searchbar /> 
            <OrderBook />
        </div>
    );
};


export default App;