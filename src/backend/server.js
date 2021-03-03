const Lodash = require('lodash')
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
 * Pre-load all symbols so as to be rapidly available for Stock Miner.
 * @todo - Needs some way to update symbols list every day or 24 hours.
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
 * Define API access points.
 */

server.get('/api/alive', (req, res) => {
    res.send({status: `success`})
})

server.get('/api/get/symbols', (req, res) => {
    res.send(all_symbols)
})

server.get('/api/get/crypto/symbols', (req, res) => {
    res.send(SymbolProvider.get_all_crypto_symbols())
})

server.get('/api/get/symbols/:chars/:limit', (req, res) => {
    let symbols = SymbolProvider.get_symbols_matching(all_symbols, req.params.chars, req.params.limit)
    res.send(symbols)
})

/**
 * Start API server.
 */
server.listen(server_port, () => console.log(`${server_name} -  Listening on port ${server_port}`))