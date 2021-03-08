const Lodash = require('lodash')
const Express = require('express')
const WebSocket = require('ws')
const Cors = require('cors')
const BodyParser = require('body-parser')
const SymbolProvider = require('./sm_symbol_provider.js')
const {DataProvider} = require('./sm_data_provider.js')
const {v4: uuidv4} = require('node-uuid')
const app = Express()
const server_name = 'Stock Miner API Server'
const server_port = 2222;

/**
 * Configure API server.
 */
app.use(Cors({origin: 'http://localhost:1234'}))
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended: true}))

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
app.get('/api/alive', (req, res) => {
    res.send(res.send({success: true}))
})

app.get('/api/get/symbols', (req, res) => {
    res.send(all_symbols)
})

app.get('/api/get/crypto/symbols', (req, res) => {
    res.send(SymbolProvider.get_all_crypto_symbols())
})

app.get('/api/get/all', (req, res) => {
    res.send(DP.STREAM_DATA)
})

app.get('/api/quote/:type/:symbol', (req, res) => {
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

app.get('/api/get/symbols/:chars/:limit', (req, res) => {
    let symbols = SymbolProvider.get_symbols_matching(all_symbols, req.params.chars, req.params.limit)
    res.send(symbols)
})

app.get('/api/register/:uuid/:type/:symbol', (req, res) => {
    DP.register_trade(req.params.uuid, req.params.type.toUpperCase(), req.params.symbol.toUpperCase())
    res.send({success: true})
})

app.get('/api/deregister/:uuid', (req, res) => {
    if (!DP.deregister_trade(req.params.uuid)) {
        res.send({success: false})
    } else {
        res.send({success: true})
    }
})

/**
 * Initialize the API HTTP server.
 */
const server = app.listen(server_port, () => console.log(`${server_name} -  Listening on port ${server_port}`))

/**
 * Initialize the WebSocket server.
 */
const wss = new WebSocket.Server({port: 2223})
const wss_clients = {};
wss.on('connection', (cobj) => {
    let client_id = uuidv4()
    wss_clients[client_id] = cobj
    console.log('SM: MESSAGE: New WebSocket connection from client.')

    // Send message to client
    cobj.on('message', (message) => {

    })

    // Main interval loop that sends our updated stream data to client
    setInterval(() => {
        cobj.send(JSON.stringify(DP.STREAM_DATA))
    }, 1000)
})