const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

/**
 * DBManager manages all interactions with the Stock Miner database.
 */
class DBManager {

    constructor() {
        this.DB_PATH_MEMORY = ':memory:'
        this.DB_PATH_FILE = '/db/sm.db'
        this.DB = this.init_db()
    }

    /**
     * Initialize the database: Build its tables and connectors.
     */
    init_db = () => {
        const DB = new sqlite3.Database(__dirname + this.DB_PATH_FILE, (err1) => {
            if (err1) {
                console.log(err1)
                return
            }
            console.log('SMDB: Connected to ' + this.DB_PATH_FILE + ' database.')

            DB.exec('PRAGMA foreign_keys = ON;', (err2) => {
                if (err2) {
                    console.log('SMDB: Pragma statement did not work.')
                } else {
                    console.log('SMDB: Foreign Key Enforcement is turned on.')
                }
            })
        })
        return DB
    }

    /**
     * Close the current instances connection to the database.
     */
    close_db = () => {
        this.DB.close((err) => {
            if (err) {
                return console.error(err.message)
            }
            console.log('SMDB: Closed the database connection.')
        })
    }

    /**
     * Loads .sql files and executes SQL queries on the database.
     */
    run_sql_file = (file_name) => {
        const dataSQL = fs.readFileSync(__dirname + '/sql/' + file_name).toString()
        const dataArr = dataSQL.split(';')
        this.DB.serialize(() => {
            this.DB.run('BEGIN TRANSACTION;')
            dataArr.forEach((query) => {
                if (query) {
                    query += ';'
                    this.DB.run(query, (err) => {
                        if (err) throw err;
                        else console.log("SMDB: Building table.")
                    })
                }
            })
            this.DB.run('COMMIT;')
        })
    }

    /**
     * Build the database's tables should they not exist.
     */
    build_tables = () => {
        this.run_sql_file('sm_schema.sql')
    }

    /**
     * WARNING!!! - Completely removes all tables from the database. This should never
     * be used outside of development.
     */
    drop_tables = () => {
        this.run_sql_file('sm_drop_tables.sql')
    }

    /**
     * Add an entry to the Profiles table.
     */
    add_profile_entry = (profile_name) => {
        let sql = "INSERT INTO Profiles (profile_name) "
        sql += "VALUES (?) "
        this.DB.run(sql, [profile_name], function (err) {
            if (err) {
                console.log("SMDB:" + err)
            } else {
                console.log("SMDB: Profiles: Last ID: " + this.lastID)
                console.log("SMDB: Profiles: # of Row Changes: " + this.changes)
            }
        })
    }

    /**
     * Add an entry to the Stock_Orders or Stock_Simulations table.
     */
    add_stock_orders_entry = (options) => {
        let
            simulation = options.simulation || false,
            table = simulation ? 'Stock_Simulations' : 'Stock_Orders',
            uuid = options.uuid,
            profile = options.profile,
            market = options.market,
            order_type = options.order_type,
            symbol = options.symbol,
            price = options.price,
            shares = options.shares,
            cost_basis = options.cost_basis,
            limit_buy = options.limit_buy,
            limit_sell = options.limit_sell,
            order_date = options.order_date,
            exec_date = options.exec_date
        let sql = `INSERT INTO ${table} (uuid, profile, market, order_type, symbol, price, shares, cost_basis, limit_buy, limit_sell, order_date, exec_date) `
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
        this.DB.run(sql, [uuid, profile, market, order_type, symbol, price, shares, cost_basis, limit_buy, limit_sell, order_date, exec_date], function (err) {
            if (err) {
                console.log("SMDB:" + err)
            } else {
                console.log(`SMDB: ${table}: Last ID: ` + this.lastID)
                console.log(`SMDB: ${table}: # of Row Changes: ` + this.changes)
            }
        })
    }

    /**
     * Add an entry to the Stock_Holdings table.
     */
    add_stock_holdings_entry = (uuid, profile, market, symbol, shares, price, cost_basis, simulated) => {
        let sql = "INSERT INTO Stock_Holdings (uuid, profile, market, symbol, shares, price, cost_basis, simulated) "
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?) "
        this.DB.run(sql, [uuid, profile, market, symbol, shares, price, cost_basis, simulated], function (err) {
            if (err) {
                console.log("SMDB:" + err)
            } else {
                console.log("SMDB: Stock_Holdings: Last ID: " + this.lastID)
                console.log("SMDB: Stock_Holdings: # of Row Changes: " + this.changes)
            }
        })
    }

    /**
     * Add an entry to the Stock_Records table.
     */
    add_stock_record_entry = (market, symbol, quote, timestamp) => {
        let sql = "INSERT INTO Stock_Records (market, symbol, quote, timestamp) "
        sql += "VALUES (?, ?, ?, ?) "
        this.DB.run(sql, [market, symbol, quote, timestamp], function (err) {
            if (err) {
                console.log("SMDB:" + err)
            } else {
                console.log("SMDB: Stock_Records: Last ID: " + this.lastID)
                console.log("SMDB: Stock_Records: # of Row Changes: " + this.changes)
            }
        })
    }
}

module.exports = {
    DBManager: DBManager
}

//@todo - Testing and development
let DBM = new DBManager()

// DBM.build_tables()

// DBM.drop_tables()

// DBM.add_profile_entry("test_profile")

// DBM.add_stock_record_entry("CRYPTO", "BTC", "100000", Date.now())

// DBM.add_stock_orders_entry({
//     simulation: true,
//     uuid: '2389-23982-fss-232',
//     profile: 'test_profile',
//     market: 'CRYPTO',
//     order_type: 'buy',
//     symbol: 'BTC',
//     price: 32092,
//     shares: 0.02392,
//     cost_basis: 5000,
//     limit_buy: 0,
//     limit_sell: 0,
//     order_date: Date.now(),
//     exec_date: Date.now()
// })

// DBM.add_stock_holdings_entry(
//     "sdf-239-sdf",
//     "test_profile",
//     "CRYPTO",
//     "BTC",
//     "0.2345",
//     "49342",
//     "5000",
//     true
// )