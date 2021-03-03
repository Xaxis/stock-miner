const Express = require('express')
const Cors = require('cors')
const BodyParser = require('body-parser')
const SymbolProvider = require('./sm_symbol_provider.js')
const server = Express()
const server_name = 'Stock Miner API Server'
const server_port = 2222;

/**
 * Configure server.
 */
server.use(Cors({
    origin: 'http://localhost:1234'
}))
server.use(BodyParser.json())
server.use(BodyParser.urlencoded({extended: true}))

/**
 * Pre-load all market symbols so as to be rapidly available for Stock Miner.
 */
let market_symbols = []
SymbolProvider.get_all_finra_symbols_object()
    .then((res) => {
        market_symbols = res
    })
    .catch((error) => {
        console.log('Error: ', error)
    })

/**
 * Define API access points.
 */

server.get('/api/alive', (req, res) => {
    res.send({status: `success`})
})

server.get('/api/get/symbols', (req, res) => {
    res.send(market_symbols)
})

server.get('/api/get/symbols/:chars/:limit', (req, res) => {
    let symbols = SymbolProvider.get_symbols_matching(market_symbols, req.params.chars, req.params.limit)
    res.send(symbols)
})

/**
 * Start API server.
 */
server.listen(server_port, () => console.log(`${server_name} -  Listening on port ${server_port}`))