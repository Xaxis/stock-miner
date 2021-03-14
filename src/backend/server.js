const Lodash = require('lodash')
const Express = require('express')
const WebSocket = require('ws')
const Cors = require('cors')
const BodyParser = require('body-parser')
const {DBManager} = require('./sm_db_manager.js')
const {SymbolProvider} = require('./sm_symbol_provider.js')
const {DataProvider} = require('./sm_data_provider.js')
const {v4: uuidv4} = require('node-uuid')
const app = Express()
const server_name = 'Stock Miner API Server'
const server_port = 2222;


/**
 * Configure APP/API server for application routes.
 */
app.use(Cors())
app.options('*', Cors())
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended: true}))


/**
 * Pre-load all symbols so as to be rapidly available for consumption.
 */
let all_symbols = []
let SP = new SymbolProvider()
SP.get_all_finra_symbols()
    .then((res) => {
        let crypto_symbols = SP.get_all_crypto_symbols()
        let forex_symbols = SP.get_all_forex_symbols()
        let concat_symbols = res.concat(crypto_symbols).concat(forex_symbols)
        let sorted_symbols = Lodash.orderBy(concat_symbols, 's', 'asc')
        all_symbols = sorted_symbols
    })
    .catch((error) => {
        console.log('Error: ', error)
    })


/**
 * Initialize the Stock Miner Data Base Manager.
 */
let DBM = new DBManager()


/**
 * Initialize the Stock Miner Data Provider.
 */
let DP = new DataProvider()


/**
 * APP routes - Routes that should not be used outside the APP. Most of them
 * interact with the database in some way.
 */

app.get('/app/get/profiles/list', (req, res) => {
    DBM.get_profile_list()
        .then((rows) => {
            let profileList = []
            rows.forEach((row) => {
                profileList.push({
                    name: row.profile,
                    status: row.status
                })
            })
            res.send(profileList)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/profiles/active', (req, res) => {
    DBM.get_profile_active()
        .then((row) => {
            let activeProfile = row ? [row.active_profile] : []
            res.send(activeProfile)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/add/profiles/:profile', (req, res) => {
    DBM.add_profile_entry(req.params.profile)
        .then(() => {
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/set/profiles/active/:profile', (req, res) => {
    DBM.update_config(req.params.profile, req.params.profile)
        .then(() => {
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/delete/profiles/:profile', (req, res) => {
    DBM.delete_profile_entry(req.params.profile)
        .then(() => {
            DBM.update_config('noop', 'noop')
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/rename/profiles/:oldprofile/:newprofile', (req, res) => {
    DBM.rename_profile(req.params.oldprofile, req.params.newprofile)
        .then(() => {
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/set/profiles/status/:profile/:status', (req, res) => {
    DBM.set_profile_status(req.params.profile, req.params.status)
        .then(() => {
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/get/orders/list/:profile/:type', (req, res) => {
    DBM.get_stock_orders_by_profile(req.params.profile, (req.params.type === 'simulated'))
        .then((rows) => {
            res.send(rows)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/orders/:profile/:symbol/:type', (req, res) => {
    DBM.get_stock_orders_by_profile_at_symbol(req.params.profile, req.params.symbol, (req.params.type === 'simulated'))
        .then((rows) => {
            res.send(rows)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/orders/:profile/:uuid/:type', (req, res) => {
    DBM.get_stock_orders_by_profile_at_uuid(req.params.profile, req.params.uuid, (req.params.type === 'simulated'))
        .then((rows) => {
            res.send(rows)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/register/orders/:profile/:type/:uuid/:market/:symbol/:name', (req, res) => {
    DBM.add_stock_orders_entry({
        profile: req.params.profile,
        simulated: (req.params.type === 'simulated'),
        uuid: req.params.uuid,
        market: req.params.market,
        symbol: req.params.symbol,
        name: req.params.name,
        order_date: Date.now()
    }).then(() => {
        DBM.get_stock_orders_by_profile_at_uuid(req.params.profile, req.params.uuid, (req.params.type === 'simulated'))
            .then((rows) => {
                res.send(rows)
            })
            .catch(() => {
                res.send([])
            })
    })
})

//@todo - Write an /app/deregister/orders/.... route...


/**
 * API Routes - Routes that can be used outside of the application as standalone
 * consumable data.
 */

app.get('/api/get/symbols', (req, res) => {
    res.send(all_symbols)
})

app.get('/api/get/crypto/symbols', (req, res) => {
    res.send(SP.get_all_crypto_symbols())
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
    let symbols = SP.get_symbols_matching(all_symbols, req.params.chars, req.params.limit)
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