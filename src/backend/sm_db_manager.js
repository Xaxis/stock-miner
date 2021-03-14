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
     * Updates the config parameters in the Config table.
     */
    update_config = (active_profile, default_profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `
            INSERT OR REPLACE INTO Config (id, active_profile, default_profile)
            VALUES (1, ?, ?) `
            self.DB.run(sql, [active_profile, default_profile], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log("SMDB: Config: Last ID: " + this.lastID)
                    console.log("SMDB: Config: # of Row Changes: " + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Add an entry to the Profiles table.
     */
    add_profile_entry = (profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = "INSERT INTO Profiles (profile) "
            sql += "VALUES (?) "
            self.DB.run(sql, [profile], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log("SMDB: Profiles: Last ID: " + this.lastID)
                    console.log("SMDB: Profiles: # of Row Changes: " + this.changes)

                    // Update config to profile that is active
                    self.update_config(profile, profile)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Add an entry to the Stock_Orders or Stock_Simulations table.
     */
    add_stock_orders_entry = (options) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let
                table = options.simulated ? 'Stock_Simulations' : 'Stock_Orders',
                uuid = options.uuid,
                profile = options.profile,
                market = options.market,
                order_type = options.order_type || 'waiting',
                symbol = options.symbol,
                name = options.name,
                price = options.price || -1,
                shares = options.shares || -1,
                cost_basis = options.cost_basis || -1,
                limit_buy = options.limit_buy || -1,
                limit_sell = options.limit_sell || -1,
                order_date = options.order_date,
                exec_date = options.exec_date || -1
            let sql = `INSERT INTO ${table} (uuid, profile, market, order_type, symbol, name, price, shares, cost_basis, limit_buy, limit_sell, order_date, exec_date) `
            sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
            self.DB.run(sql, [uuid, profile, market, order_type, symbol, name, price, shares, cost_basis, limit_buy, limit_sell, order_date, exec_date], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: ${table}: Last ID: ` + this.lastID)
                    console.log(`SMDB: ${table}: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Add an entry to the Stock_Holdings table.
     * @todo - Refactor this to include options argument and return as promise.
     */
    add_stock_holdings_entry = (uuid, profile, market, symbol, name, shares, price, cost_basis, simulated) => {
        let sql = "INSERT INTO Stock_Holdings (uuid, profile, market, symbol, name, shares, price, cost_basis, simulated) "
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "
        this.DB.run(sql, [uuid, profile, market, symbol, name, shares, price, cost_basis, simulated], function (err) {
            if (err) {
                console.log("SMDB: " + err)
            } else {
                console.log("SMDB: Stock_Holdings: Last ID: " + this.lastID)
                console.log("SMDB: Stock_Holdings: # of Row Changes: " + this.changes)
            }
        })
    }

    /**
     * Add an entry to the Stock_Records table.
     * @todo - Refactor this to return as promise.
     */
    add_stock_record_entry = (market, symbol, quote, timestamp) => {
        let sql = "INSERT INTO Stock_Records (market, symbol, quote, timestamp) "
        sql += "VALUES (?, ?, ?, ?) "
        this.DB.run(sql, [market, symbol, quote, timestamp], function (err) {
            if (err) {
                console.log("SMDB: " + err)
            } else {
                console.log("SMDB: Stock_Records: Last ID: " + this.lastID)
                console.log("SMDB: Stock_Records: # of Row Changes: " + this.changes)
            }
        })
    }

    /**
     * Returns a Promise that returns all profile names in the Profile table.
     */
    get_profile_list = () => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT DISTINCT profile, status FROM Profiles`
            self.DB.all(sql, function (err, rows) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject([])
                }
                let result = []
                rows.forEach((row) => {
                    result.push(row)
                })
                resolve(result)
            })
        })
    }

    /**
     * Returns a Promise containing the active profile name from the Config table.
     */
    get_profile_active = () => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT active_profile FROM Config`
            self.DB.get(sql, function (err, row) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject([])
                }
                resolve(row)
            })
        })
    }

    /**
     * Removes a row from the Profile table that matches 'profile'
     */
    delete_profile_entry = (profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = "DELETE FROM Profiles WHERE profile = ? "
            self.DB.run(sql, [profile], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log("SMDB: Profiles: Last ID: " + this.lastID)
                    console.log("SMDB: Profiles: # of Row Changes: " + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Renames an existing 'profile' in the Profiles table AND updates all correlated
     * rows in the Stock_Orders and Stock_Simulations table. Also sets the active table
     * in the application's Config table.
     */
    rename_profile = (old_name, new_name) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `UPDATE Profiles SET profile = ? WHERE profile = ?`
            self.DB.run(sql, [new_name, old_name], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: true})
                } else {
                    console.log("SMDB: Profiles: Last ID: " + this.lastID)
                    console.log("SMDB: Profiles: # of Row Changes: " + this.changes)

                    // Update the application config to point to the active profile
                    self.update_config(new_name, new_name)

                    // Update profile field in all matching rows in Stock_Orders & Stock_Simulations
                    self.update_stock_orders_by_profile_at_field_value(old_name, true, 'profile', new_name)
                    self.update_stock_orders_by_profile_at_field_value(old_name, false, 'profile', new_name)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Sets a given profiles 'status' flag in the Profiles table.
     */
    set_profile_status = (profile, status) => {
        const self = this
        let sql = `UPDATE Profiles SET status = ? WHERE profile = ?`
        return new Promise(function (resolve, reject) {
            self.DB.run(sql, [status, profile], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log("SMDB: Profiles: Last ID: " + this.lastID)
                    console.log("SMDB: Profiles: # of Row Changes: " + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Returns a list of stock orders from the Stock_Orders or Stock_Simulations tables by
     * their profile association.
     */
    get_stock_orders_by_profile = (profile, simulated) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM ${table} WHERE profile = ?`
            self.DB.all(sql, [profile], function (err, rows) {
                if (err) {
                    console.log("SMDB: " + table + err)
                    reject([])
                }
                let result = []
                rows.forEach((row) => {
                    result.push(row)
                })
                resolve(result)
            })
        })
    }

    /**
     * Returns a list of stock orders from the Stock_Orders or Stock_Simulations tables by
     * their profile AND symbol association.
     */
    get_stock_orders_by_profile_at_symbol = (profile, symbol, simulated) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM ${table} WHERE profile = ? AND symbol = ?`
            self.DB.all(sql, [profile, symbol], function (err, rows) {
                if (err) {
                    console.log("SMDB: " + table + err)
                    reject([])
                }
                let result = []
                rows.forEach((row) => {
                    result.push(row)
                })
                resolve(result)
            })
        })
    }

    /**
     * Returns a list of stock orders from the Stock_Orders or Stock_Simulations tables by
     * their profile AND symbol association.
     */
    get_stock_orders_by_profile_at_uuid = (profile, uuid, simulated) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM ${table} WHERE profile = ? AND uuid = ?`
            self.DB.all(sql, [profile, uuid], function (err, rows) {
                if (err) {
                    console.log("SMDB: " + table + err)
                    reject([])
                }
                let result = []
                rows.forEach((row) => {
                    result.push(row)
                })
                resolve(result)
            })
        })
    }

    /**
     * Returns a promise after updating Stock_orders or Stock_Simulations table rows grouped by
     * profile at a defined field and value.
     */
    update_stock_orders_by_profile_at_field_value = (profile, simulated, field, value) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `UPDATE ${table} SET ${field} = ? WHERE profile = ?`
            self.DB.run(sql, [value, profile], function (err) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: ${table}: Last ID: ` + this.lastID)
                    console.log(`SMDB: ${table}: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

}

module.exports = {
    DBManager: DBManager
}