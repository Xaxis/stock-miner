const Lodash = require('lodash')
const Express = require('express')
const Cors = require('cors')
const BodyParser = require('body-parser')
const {DBManager} = require('./sm_db_manager.js')
const {SymbolProvider} = require('./sm_symbol_provider.js')
const {DataProvider} = require('./sm_data_provider.js')
const {DataTransducer} = require('./sm_data_transducer.js')
const {OrderProcessor} = require('./sm_order_processor.js')
const {WebSocketServer} = require('./sm_websocket_server.js')
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
 * Initialize Symbol Provider and pre-load all symbols so as to
 * be rapidly available for consumption by the application.
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
 * Initialize the Data Base Manager.
 */
let DBM = new DBManager()


/**
 * Initialize the Data Provider.
 */
let DP = new DataProvider()


/**
 * Initialize the Order Processor.
 */
let OP = new OrderProcessor(DBM)


/**
 * Initialize the Data Transducer.
 */
let DT = new DataTransducer(DBM, DP, OP)


/**
 * Initialize Web Socket Server
 */
let WSS = new WebSocketServer(DBM, DP, DT)


/**
 * APP routes - Routes that should not be used outside the APP. Most of them
 * interact with the database in some way.
 */

app.get('/app/get/config', (req, res) => {
    DBM.get_config()
        .then((row) => {
            res.send(row)
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/set/taskfrequency/:ms', (req, res) => {
    DBM.update_config_multi_field_values({task_frequency: req.params.ms})
        .then(() => {
            DT.reset_task_interval(req.params.ms)
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/set/pollingfrequency/:ms', (req, res) => {
    DBM.update_config_multi_field_values({polling_frequency: req.params.ms})
        .then(() => {
            WSS.reset_task_interval(req.params.ms)
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

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
    DBM.update_config_multi_field_values({active_profile: req.params.profile})
        .then(() => {
            DT.build_all_active_tasks_from_db()
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/delete/profiles/:profile', (req, res) => {
    DBM.delete_profile_entry(req.params.profile)
        .then(() => {
            DBM.update_config_multi_field_values({active_profile: 'noop'})
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
            let profile_paused = req.params.status === 'paused'

            // When a profile is set to paused, set all 'Running' order rows paused state to true
            if (profile_paused) {
                DBM.get_all_stock_orders_where_multi_field_values({profile: req.params.profile, status: 'Running'})
                    .then((rows) => {
                        rows.forEach((row) => {
                            DBM.update_all_stock_orders_by_uuid_with_multi_field_values(row.uuid, {paused: true})

                            // Add order history entries
                            DBM.add_stock_orders_history_entry({
                                uuid: row.uuid,
                                event: 'PAUSED',
                                info: `Order PAUSED and waiting to run.`
                            })
                        })
                        DT.build_all_active_tasks_from_db()
                    })
            }

            // Otherwise update orders to un-paused ('Running') state.
            else {
                DBM.get_all_stock_orders_where_multi_field_values({profile: req.params.profile, status: 'Running'})
                    .then((rows) => {
                        rows.forEach((row) => {
                            DBM.update_all_stock_orders_by_uuid_with_multi_field_values(row.uuid, {paused: false})

                            // Add order history entries
                            DBM.add_stock_orders_history_entry({
                                uuid: row.uuid,
                                event: 'RUNNING',
                                info: `Order RUNNING and waiting to execute.`
                            })
                        })
                        DT.build_all_active_tasks_from_db()
                    })
            }
            res.send({success: true})
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/get/orders/list/:profile/:simulated', (req, res) => {
    let simulated = (req.params.simulated === 'simulated')
    DBM.get_stock_orders_by_profile(req.params.profile, simulated)
        .then((rows) => {
            DT.set_active_stream_profile(req.params.profile)
            DT.add_active_tasks(rows)
            DT.build_all_active_tasks_from_db()
            res.send(DT.parse_row_data_status(rows))
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/orders/symbol/:profile/:symbol/:type', (req, res) => {
    DBM.get_stock_orders_by_profile_at_symbol(req.params.profile, req.params.symbol, (req.params.type === 'simulated'))
        .then((rows) => {
            res.send(DT.parse_row_data_status(rows))
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/orders/uuid/:profile/:uuid', (req, res) => {
    DBM.get_stock_orders_by_profile_at_uuid(req.params.profile, req.params.uuid)
        .then((rows) => {
            res.send(DT.parse_row_data_status(rows))
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/get/orders/history/:uuid', (req, res) => {
    DBM.get_stock_orders_history_by_uuid(req.params.uuid)
        .then((rows) => {
            res.send(rows)
        })
        .catch(() => {
            res.send([])
        })
})

app.get('/app/register/orders/:profile/:type/:uuid/:market/:symbol/:name', (req, res) => {
    let profile, type, uuid, market, symbol, name;
    ({profile, type, uuid, market, symbol, name} = req.params)
    let simulated = (type === 'simulated')

    // Add trade to database and return new trade to client
    DBM.add_stock_orders_entry({
        profile: profile,
        simulated: simulated,
        uuid: uuid,
        market: market,
        symbol: symbol,
        name: name,
        order_date: Date.now()
    }).then(() => {

        // Send registered order row back to client
        DBM.get_stock_orders_by_profile_at_uuid(profile, uuid)
            .then((rows) => {
                res.send(rows)
            })
            .catch(() => {
                res.send([])
            })

        // Register active task with the Data Transducer
        DT.add_active_task(profile, uuid, market, symbol)

        // Re-build all profile tasks
        DT.build_all_active_tasks_from_db()

        // Add a History entry
        DBM.add_stock_orders_history_entry({
            uuid: uuid,
            event: 'REGISTERED',
            info: `Order was REGISTERED and waiting for action.`
        })
    })
})

app.get('/app/deregister/orders/:simulated/:uuid', (req, res) => {
    DT.remove_active_task(req.params.uuid)
    let simulated = (req.params.simulated === 'simulated')
    DBM.delete_stock_orders_by_uuid(simulated, req.params.uuid)
        .then(() => {
            res.send({success: true})

            // Re-build all profile tasks
            DT.build_all_active_tasks_from_db()

            // Delete/deregister stock order history associated with UUID
            DBM.delete_stock_orders_history_by_uuid(req.params.uuid)
        })
        .catch(() => {
            res.send({success: false})
        })
})

app.get('/app/order/buy/:uuid/:cost_basis/:purchase_price/:limit_buy/:limit_sell/:loss_perc', (req, res) => {
    let uuid, cost_basis, purchase_price, limit_buy, limit_sell, loss_perc;
    ({uuid, cost_basis, purchase_price, limit_buy, limit_sell, loss_perc} = req.params)

    // Retrieve and verify profile status
    DBM.get_profile_status(DT.get_active_stream_profile())
        .then((status) => {
            let paused = status == 'active' ? 'false' : 'true'

            // Build field/value object to put into database
            let set_data = {
                cost_basis: cost_basis,
                limit_buy: limit_buy || 0,
                limit_sell: limit_sell || 0,
                loss_perc: loss_perc || 0,
                purchase_price: purchase_price || 0,
                order_type: 'buy',
                status: 'Running',
                paused: paused
            }

            // Add order history entries
            if (cost_basis) {
                DBM.add_stock_orders_history_entry({
                    uuid: uuid,
                    event: 'BUY',
                    info: `Order BUY placed with $${cost_basis} cost basis and is waiting to run.`
                })
            }
            if (limit_buy || limit_sell) {
                DBM.add_stock_orders_history_entry({
                    uuid: uuid,
                    event: 'LIMIT',
                    info: `Order augmented with LIMIT values: (BUY: $${limit_buy}/SELL: $${limit_sell}).`
                })
            }
            if (loss_perc) {
                DBM.add_stock_orders_history_entry({
                    uuid: uuid,
                    event: 'LOSS_PREVENT',
                    info: `Order augmented with LOSS_PREVENT value: (${loss_perc}%).`
                })
            }
            if (paused === 'true') {
                DBM.add_stock_orders_history_entry({
                    uuid: uuid,
                    event: 'PAUSED',
                    info: `Order PAUSED and waiting to run.`
                })
            }
            if (paused === 'false') {
                DBM.add_stock_orders_history_entry({
                    uuid: uuid,
                    event: 'RUNNING',
                    info: `Order RUNNING and waiting to execute.`
                })
            }

            // Update orders by UUID wherever they exist (Stock_Simulations or Stock_Orders)
            DBM.update_all_stock_orders_by_uuid_with_multi_field_values(uuid, set_data)
                .then(() => {
                    res.send({success: true})

                    // Re-build all profile tasks
                    DT.build_all_active_tasks_from_db()
                })
        })
})


/**
 * API Routes - Routes that can be used outside of the application as standalone
 * consumable data.
 */

app.get('/api/get/symbols', (req, res) => {
    res.send(all_symbols)
})

app.get('/api/get/data/all', (req, res) => {
    res.send(DP.STREAM_DATA)
})

app.get('/api/get/crypto/symbols', (req, res) => {
    res.send(SP.get_all_crypto_symbols())
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

app.get('/api/register/symbol/:uuid/:market/:symbol', (req, res) => {
    DP.register_trade(req.params.uuid, req.params.market.toUpperCase(), req.params.symbol.toUpperCase())
    res.send({success: true})
})

app.get('/api/deregister/symbol/:market/:symbol', (req, res) => {
    if (!DP.deregister_trade(req.params.market, req.params.symbol)) {
        res.send({success: false})
    } else {
        res.send({success: true})
    }
})


/**
 * Initialize the APP/API HTTP server.
 */
app.listen(server_port, () => console.log(`${server_name} -  Listening on port ${server_port}`))