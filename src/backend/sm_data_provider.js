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
     * Build the Polygon.io subscription parameter string
     */
    build_param_string = (trade) => {
        let param_str = ''
        switch (trade.type) {
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
     * Subscribes to a websocket stream channel from Polygon.io
     */
    add_trade_to_stream = (tradeToAdd) => {
        let tradesOfSameType = this.REGISTERED_TRADES.filter((trade) => {
            return tradeToAdd.type === trade.type && tradeToAdd.symbol === trade.symbol
        })

        // Don't subscribe if channel subscription already exists
        if (!tradesOfSameType.length) {
            let param_str = this.build_param_string(tradeToAdd)
            this.WS[tradeToAdd.type].send(JSON.stringify({
                "action": "subscribe",
                "params": param_str
            }))
        }
    }

    /**
     * Unsubscribes from a websocket stream channel from Polygon.io
     */
    remove_trade_from_stream = (tradeToRemove) => {
        let tradesOfSameType = this.REGISTERED_TRADES.filter((trade) => {
            return trade.type === tradeToRemove.type && trade.symbol === tradeToRemove.symbol
        })

        // Don't unsubscribe stream if there are other active trades of the same type and symbol
        if (!tradesOfSameType.length) {
            let param_str = this.build_param_string(tradeToRemove)
            this.WS[tradeToRemove.type].send(JSON.stringify({
                "action": "unsubscribe",
                "params": param_str
            }))
        }
    }

    /**
     * Registers a trade with the REGISTERED_TRADES object, a single source of truth
     * containing all active trade instances the app is using. Each trade object contains
     * a unique id, trade type, and corresponding symbol.
     *
     * Secondly, subscribes to another trade channel if one does not already exist.
     */
    register_trade = (uuid, type, symbol) => {
        let trade = {uuid: uuid, type: type, symbol: symbol}
        this.add_trade_to_stream(trade)
        this.REGISTERED_TRADES.push(trade)
    }

    /**
     * Deregisters and removes a trade from the REGISTERED_TRADES object.
     *
     * Secondly, unsubscribes from channel subscription if there aren't any other trades
     * actively using the same channel.
     */
    deregister_trade = (uuid) => {
        let newRegisteredTradesArray = this.REGISTERED_TRADES.filter((trade) => {
            return trade.uuid !== uuid
        })
        let tradeBeingDeregistered = this.REGISTERED_TRADES.filter((trade) => {
            return trade.uuid === uuid
        })
        if (!tradeBeingDeregistered.length) {
            console.log(`SM API: UUID (${uuid}) provided not found in registered trades.`)
            return false
        } else {
            this.REGISTERED_TRADES = newRegisteredTradesArray
            this.remove_trade_from_stream(tradeBeingDeregistered[0])
            return true
        }
    }
}

module.exports = {
    DataProvider: DataProvider
}