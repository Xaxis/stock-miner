const W3CWebSocket = require('websocket').w3cwebsocket

/**
 * DataProvider manages registration and de-registration of trade data and
 * acts as a proxy server for Stock Miner, establishing a web socket stream
 * from our data provider and distributing that data to the client application.
 */
class DataProvider {

    constructor() {
        this.API_KEY = '_nnkbN3IuzOKDecrdiwKe5eLmU_dAzV1'
        this.WS_URL = 'wss://socket.polygon.io/'
        this.REST_STOCKS_URL = 'https://api.polygon.io/v1/'
        this.REGISTERED_TRADES = []
        this.STREAM_DATA = {
            STOCK: [],
            FOREX: [],
            CRYPTO: []
        }
        this.WS = {
            // STOCK: this.build_websocket(this.WS_URL+'stocks', this.API_KEY),
            CRYPTO: this.build_websocket(this.WS_URL + 'crypto', this.API_KEY),
            // FOREX: this.build_websocket(this.WS_URL+'forex', this.API_KEY)
        }
    }

    /**
     * Creates and returns a websocket and its handlers.
     */
    build_websocket = (ws_url, api_key) => {
        let ws = new W3CWebSocket(ws_url)

        ws.onopen = () => {
            if (ws.readyState === ws.OPEN) {
                let auth_msg = {
                    "action": "auth",
                    "params": api_key
                }
                ws.send(JSON.stringify(auth_msg))
            }
        }

        ws.onmessage = (msg) => {
            let stream_arr = JSON.parse(msg.data)

            // Log non data messages to the console
            if (stream_arr[0].hasOwnProperty("status")) {
                console.log('MESSAGE from ' + ws_url, msg.data)
            }

            // Continually build STREAM_DATA object from streamed data
            stream_arr.forEach((stream) => {
                switch (stream.ev) {
                    case 'Q':
                        this.STREAM_DATA.STOCK[stream.sym] = {
                            bp: stream.bp, bs: stream.bs, bx: stream.bx,
                            ap: stream.ap, as: stream.as, c: stream.c,
                            t: stream.t
                        }
                        break
                    case 'C':
                        this.STREAM_DATA.STOCK[stream.p] = {
                            x: stream.x, a: stream.a, b: stream.b,
                            t: stream.b
                        }
                        break
                    case 'XQ':
                        let symbol = stream.pair.replace("-USD", "")
                        this.STREAM_DATA.CRYPTO[symbol] = {
                            lp: stream.lp, ls: stream.ls, bp: stream.bp,
                            bs: stream.bs, ap: stream.ap, as: stream.as,
                            t: stream.t, x: stream.x, r: stream.r
                        }
                        break
                }
            })
        }

        ws.onclose = (msg) => {
            // console.log('CLOSE', msg)
        }

        ws.onerror = (msg) => {
            // console.log('ONERROR', msg)
        }

        return ws
    }

    /**
     * ...
     */
    add_trade_to_stream = (trade) => {
        let param_str = ''
        switch (trade.type) {
            case 'stock':
                param_str += 'Q.' + trade.symbol.toUpperCase() + '-USD'
                break
            case 'forex':
                param_str += 'C.' + trade.symbol.toUpperCase() + '-USD'
                break
            case 'crypto':
                param_str += 'XQ.' + trade.symbol.toUpperCase() + '-USD'
                break
        }

        this.WS[trade.type.toUpperCase()].send(JSON.stringify({
            "action": "subscribe",
            "params": param_str
        }))
    }

    /**
     * ...
     */
    remove_trade_from_stream = (uuid) => {

    }

    /**
     * ...
     */
    register_trade = (uuid, type, symbol) => {
        let trade = {uuid: uuid, type: type, symbol: symbol}
        this.REGISTERED_TRADES.push(trade)
        this.add_trade_to_stream(trade)
    }

    /**
     * ...
     */
    deregister_trade = (uuid) => {
        let newRegisteredTrades = this.REGISTERED_TRADES.filter((trade) => {
            return trade.uuid !== uuid
        })
        this.REGISTERED_TRADES = newRegisteredTrades
    }
}

module.exports = {
    DataProvider: DataProvider
}