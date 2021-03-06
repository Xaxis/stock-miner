const Lodash = require('lodash')
const Express = require('express')
const WebSocket = require('ws')
const Cors = require('cors')
const BodyParser = require('body-parser')
const SymbolProvider = require('./sm_symbol_provider.js')
const {DataProvider} = require('./sm_data_provider.js')
const {v4: uuidv4} = require('node-uuid')
const server = Express()
const server_name = 'Stock Miner API Server'
const server_port = 2222;

/**
 * Configure API server.
 */
server.use(Cors({origin: 'http://localhost:1234'}))
server.use(BodyParser.json())
server.use(BodyParser.urlencoded({extended: true}))

/**
 * Pre-load all symbols so as to be rapidly available for Stock Miner.
 */
let all_symbols = []
SymbolProvider.get_all_finra_symbols()
    .then((res) => {
        let crypto_symbols = SymbolProvider.get_all_crypto_symbols()
        let concat_symbols = res.concat(crypto_symbols)
        let sorted_symbols = Lodash.orderBy(concat_symbols, 's', 'asc')
        all_symbols = sorted_symbols
    })
    .catch((error) => {
        console.log('Error: ', error)
    })

/**
 * Initialize the Stock Miner Data Provider.
 */
let DP = new DataProvider()

/**
 * Define API access points.
 */
server.get('/api/alive', (req, res) => {
    res.send(res.send({success: true}))
})

server.get('/api/get/symbols', (req, res) => {
    res.send(all_symbols)
})

server.get('/api/get/crypto/symbols', (req, res) => {
    res.send(SymbolProvider.get_all_crypto_symbols())
})

server.get('/api/quote/:type/:symbol', (req, res) => {
    let type = req.params.type.toUpperCase()
    let symbol = req.params.symbol.toUpperCase()
    if (type === 'STOCK' || type === 'FOREX' || type === 'CRYPTO') {
        if (DP.STREAM_DATA[type].hasOwnProperty(symbol)) {
            res.send(DP.STREAM_DATA[type][symbol])
        } else {
            res.send({success: false})
        }
    } else {
        res.send({success: false})
    }
})

server.get('/api/get/symbols/:chars/:limit', (req, res) => {
    let symbols = SymbolProvider.get_symbols_matching(all_symbols, req.params.chars, req.params.limit)
    res.send(symbols)
})

server.get('/api/register/:uuid/:type/:symbol', (req, res) => {
    DP.register_trade(req.params.uuid, req.params.type.toUpperCase(), req.params.symbol.toUpperCase())
    res.send({success: true})
})

server.get('/api/deregister/:uuid', (req, res) => {
    if (!DP.deregister_trade(req.params.uuid)) {
        res.send({success: false})
    } else {
        res.send({success: true})
    }
})

/**
 * Start API server.
 */
server.listen(server_port, () => console.log(`${server_name} -  Listening on port ${server_port}`))