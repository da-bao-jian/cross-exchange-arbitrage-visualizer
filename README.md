
![gif](https://github.com/dabaojian1992/cross-exchange-arbitrage-visualizer/blob/master/Animation.gif)

* multiplexed real time limit orderbook data stream using RxJS's [Websocket Subject](https://rxjs-dev.firebaseapp.com/api/webSocket/webSocket)

* dot size is proportional to order size

* theoretically, an arbitrage opportunity exists when one can buy low on one exchange and sell high on another due to price discrepancies. Better yet, one could divide fund into equal shares on each exchange, and rebalance after every arbitrage play. Timing and transaction fees should also be taken into consideration to make it a consistent strategy. 

#### *Not investment advice


## Road ahead

* The purpose of this project is to familiarize myself with different exchanges' websocket APIs and reactive programming paradigm. For better performance, third party aggregate data providers could be used for more granular data and latency issues;

* Coinbase and Bybit's API don't provide size for the best bid/ask orders. To get the order size, I had to scan the whole L2 orderbook on an inital request and perform insertions and deletions upon new data feeds, which greatly clogged up the traffic. For now, I set the size parameters on Coinbase and Bybit to random numbers. I'm currently building a python version of global limit orderbook based on [this](https://web.archive.org/web/20110219163448/http://howtohft.wordpress.com/2011/02/15/how-to-build-a-fast-limit-order-book/) blog post for my own system. If succesussul, I will integrate it into this project. In the meantime, any contribution is welcome. 

