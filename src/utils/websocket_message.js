

const currencyPair = 'btcusd'
const currencyPair_bitmex = 'XBTUSD'
const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);


export const subscribe_bitstamp = {
    event: 'bts:subscribe',
    data: {
        channel: `order_book_${currencyPair}`
    }
};

export const subscribe_bitmex = {
    op: "subscribe",
    args: [`orderBookL2:${currencyPair_bitmex}`],
};

