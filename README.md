To run on local machine
```
npm install && npm run start
```
![gif](https://github.com/dabaojian1992/cross-exchange-arbitrage-visualizer/blob/master/gif.gif)

*multiple tokens' live data streams are multiplexed simultaneously using RxJS's [Websocket Subject](https://rxjs-dev.firebaseapp.com/api/webSocket/webSocket);

*dots are the current best bid/ask(caramel: bid, orange: ask) offers and last best bid/ask offers on the book;

*dot size is proportional to order size;

*theoretically, an arbitrage opportunity exists when one can buy low on one exchange and sell high on another due to price discrepancies. Better yet, one could divide fund into equal shares on each exchange, and rebalance after every arbitrage play. Timing and transaction fees should also be taken into consideration to make it a consistent strategy. 

#### *Not investment advice
