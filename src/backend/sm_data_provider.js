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
        this.STREAM_DATA = {
            STOCK: {},
            FOREX: {},
            CRYPTO: {}
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
                console.log('SM API: MESSAGE from ' + ws_url, msg.data)
            }

            // Continually build STREAM_DATA object from streamed data
            stream_arr.forEach((stream) => {
                switch (stream.ev) {
                    case 'Q':
                        this.STREAM_DATA.STOCK[stream.sym] = {
                            key: stream.sym, bp: stream.bp, bs: stream.bs,
                            bx: stream.bx, ap: stream.ap, as: stream.as,
                            c: stream.c, t: stream.t
                        }
                        break
                    case 'C':
                        this.STREAM_DATA.FOREX[stream.p] = {
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
            console.log('SM API: MESSAGE from ' + ws_url, msg.data)
        }

        ws.onerror = (msg) => {
            console.log('SM API: MESSAGE from ' + ws_url, msg.data)
        }

        return ws
    }

    /**
     * Build the Polygon.io subscription parameter string
     */
    build_param_string = (trade) => {
        let param_str = ''
        switch (trade.market) {
            case 'STOCK':
                param_str += 'Q.' + trade.symbol.toUpperCase() + '-USD'
                break
            case 'FOREX':
                param_str += 'C.' + trade.symbol.toUpperCase() + '-USD'
                break
            case 'CRYPTO':
                param_str += 'XQ.' + trade.symbol.toUpperCase() + '-USD'
                break
        }

        return param_str
    }

    /**
     * Subscribes to a data stream channel.
     */
    register_trade = (market, symbol) => {
        if (market === 'forex' || market === 'FOREX') symbol += '/USD'
        let trade = {
            market: market.toUpperCase(),
            symbol: symbol.toUpperCase()
        }
        let param_str = this.build_param_string(trade)
        this.WS[trade.market].send(JSON.stringify({
            "action": "subscribe",
            "params": param_str
        }))
    }

    /**
     * Unsubscribe from a data stream channel.
     */
    deregister_trade = (market, symbol) => {
        if (market === 'forex' || market === 'FOREX') symbol += '/USD'
        let trade = {
            market: market.toUpperCase(),
            symbol: symbol.toUpperCase()
        }
        let param_str = this.build_param_string(trade)
        this.WS[trade.market].send(JSON.stringify({
            "action": "unsubscribe",
            "params": param_str
        }))
    }
}

module.exports = {
    DataProvider: DataProvider
}