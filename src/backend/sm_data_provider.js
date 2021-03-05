const W3CWebSocket = require('websocket').w3cwebsocket

/**
 * DataProvider manages registration and de-registration of trade data and
 * acts as a proxy server for Stock Miner, establishing a web socket stream
 * from our data provider and distributing that data to the client application.
 */
function DataProvider() {
    this.API_KEY = '_nnkbN3IuzOKDecrdiwKe5eLmU_dAzV1'
    this.WS_URL = 'wss://socket.polygon.io/'
    this.SOCKET_CRYPTO_URL = 'wss://socket.polygon.io/crypto'
    this.SOCKET_STOCKS_URL = 'wss://socket.polygon.io/stocks'
    this.REST_STOCKS_URL = 'https://api.polygon.io/v1/'

    this.REGISTERED_TRADES = []
    this.STREAM_DATA = []

    // this.WS_CRYPTO = build_websocket(this.WS_URL+'crypto', this.API_KEY)
    // this.WS_STOCKS = build_websocket(this.WS_URL+'crypto', this.API_KEY)
    // this.WS_FOREX = build_websocket(this.WS_URL+'forex', this.API_KEY)

    /**
     * Creates and returns a websocket and its handlers.
     *
     * Note that method must be declared as such in order for proper hoisting
     * during DataProvider object initialization.
     * @param ws_url
     * @param api_key
     */
    function build_websocket(ws_url, api_key) {
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
            console.log('MESSAGE from ' + ws_url, msg.data)
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
    const add_trade_to_stream = () => {

    }

    /**
     * ...
     */
    const remove_trade_from_stream = () => {

    }

    /**
     * ...
     */
    const register_trade = (uuid, type, symbol) => {
        this.REGISTERED_TRADES.push({uuid: uuid, type: type, symbol: symbol})
    }

    /**
     * ...
     */
    const deregister_trade = (uuid) => {
        let newRegisteredTrades = this.REGISTERED_TRADES.filter((trade) => {
            return trade.uuid !== uuid
        })
        this.REGISTERED_TRADES = newRegisteredTrades
    }


    return {
        register_trade: register_trade,
        deregister_trade: deregister_trade
    }
}

module.exports = {
    DataProvider: DataProvider
}