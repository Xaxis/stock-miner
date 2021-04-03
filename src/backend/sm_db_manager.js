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
     * Updates the config parameters in the Config table. Merges passed
     * field/value pairs into return database config object and updates the
     * config.
     */
    update_config_multi_field_values = (field_values) => {
        const self = this
        return new Promise(function (resolve, reject) {
            self.get_config()
                .then((config) => {
                    field_values = Object.assign(config || {}, field_values)
                    let sql = `INSERT OR REPLACE INTO Config `
                    let end_idx = 0
                    let fv_length = Object.keys(field_values).length
                    let key_string = '('
                    let val_string = '('
                    for (const [field, value] of Object.entries(field_values)) {
                        key_string += `${field}`
                        val_string += `"${value}"`
                        end_idx += 1
                        if (end_idx < fv_length) {
                            key_string += ", "
                            val_string += ", "
                        } else {
                            key_string += ")"
                            val_string += ")"
                        }
                    }
                    sql += key_string + " VALUES " + val_string
                    self.DB.run(sql, function (err) {
                        if (err) {
                            console.log("SMDB: " + err)
                            reject({success: false})
                        } else {
                            console.log(`SMDB: Config: Last ID: ` + this.lastID)
                            console.log(`SMDB: Config: # of Row Changes: ` + this.changes)
                            resolve({success: true})
                        }
                    })
                })
        })
    }

    /**
     * Returns a Promise containing the app's configuration values.
     */
    get_config = () => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM Config WHERE id = "1"`
            self.DB.get(sql, function (err, row) {
                if (err) {
                    console.log("SMDB: Config" + err)
                    reject([])
                }
                resolve(row)
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
                    self.update_config_multi_field_values({active_profile: profile})
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
                status = 'Waiting',
                paused = 'true',
                symbol = options.symbol,
                name = options.name,
                price = options.price || 0,
                purchase_price = options.purchase_price || 0,
                shares = options.shares || 0,
                cost_basis = options.cost_basis || 0,
                limit_buy = options.limit_buy || 0,
                limit_sell = options.limit_sell || 0,
                loss_perc = options.loss_perc || 0,
                order_type = options.order_type || 'undefined',
                order_date = options.order_date,
                exec_date = options.exec_date || 0
            let sql = `INSERT INTO ${table} (uuid, profile, market, status, paused, symbol, name, price, purchase_price, shares, cost_basis, limit_buy, limit_sell, loss_perc, order_type, order_date, exec_date) `
            sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
            self.DB.run(sql, [uuid, profile, market, status, paused, symbol, name, price, purchase_price, shares, cost_basis, limit_buy, limit_sell, loss_perc, order_type, order_date, exec_date], function (err) {
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

                    // Delete corresponding profile rows in other tables
                    self.delete_stock_orders_by_profile(profile, true)
                    self.delete_stock_orders_by_profile(profile, false)
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
                    self.update_config_multi_field_values({active_profile: new_name})

                    // Update profile field in all matching rows in Stock_Orders & Stock_Simulations
                    self.update_stock_orders_by_profile_with_multi_field_values(old_name, true, {profile: new_name})
                    self.update_stock_orders_by_profile_with_multi_field_values(old_name, false, {profile: new_name})

                    // Update Profiles_History table renaming history entries
                    self.update_profiles_history_by_profile_with_multi_field_values(old_name, {profile: new_name})
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
     * Returns the 'status' field of a given profile returned as a Promise.
     */
    get_profile_status = (profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT status FROM Profiles WHERE profile = "${profile}"`
            self.DB.get(sql, function (err, row) {
                if (err) {
                    console.log("SMDB: " + err)
                    reject([])
                }
                resolve(row.status)
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
     * Returns a promise that returns a list of rows from Stock_Orders or Stock_Simulations tables
     * where field/value conditions have been met.
     */
    get_stock_orders_where_multi_field_values = (simulated, field_values) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        let sql = `SELECT * FROM ${table} WHERE `
        let end_idx = 0
        let fv_length = Object.keys(field_values).length
        for (const [field, value] of Object.entries(field_values)) {
            sql += `${field} = "${value}"`
            end_idx += 1
            if (end_idx < fv_length) {
                sql += " AND "
            } else {
                sql += " "
            }
        }
        return new Promise(function (resolve, reject) {
            self.DB.all(sql, function (err, rows) {
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
     * Returns a promise that returns a list of rows from Stock_Orders and Stock_Simulations tables
     * where field/value conditions have been met. This is exactly the same functionality as
     * 'get_stock_orders_by_profile_where_multi_field_values' except it runs the query on BOTH orders
     * tables.
     */
    get_all_stock_orders_where_multi_field_values = (field_values) => {
        const self = this
        return new Promise(function (resolve, reject) {

            // Build promises for results spanning both types of order table (Stock_Orders and Stock_Simulations)
            let promises = []
            promises.push(self.get_stock_orders_where_multi_field_values(true, field_values))
            promises.push(self.get_stock_orders_where_multi_field_values(false, field_values))

            // Execute all promises concurrently and resolve the parsed result
            Promise.all(promises).then((results) => {
                let filtered_results = results.filter((res_arr) => {
                    return res_arr.length
                })
                resolve(filtered_results.flat())
            })
        })
    }

    /**
     * Returns a list of stock orders from the Stock_Orders and Stock_Simulations tables by
     * their profile status ('active' or 'paused').
     */
    get_stock_orders_by_profile_status = (status) => {
        const self = this
        let profile_sql = `SELECT profile FROM Profiles WHERE status = "${status}"`
        return new Promise(function (resolve, reject) {
            self.DB.all(profile_sql, function (err, profiles) {
                if (err) {
                    console.log("SMDB: Profiles" + err)
                    reject([])
                }

                // Build promises for results spanning both types of order table (Stock_Orders and Stock_Simulations)
                let promises = []
                profiles.forEach((profile) => {
                    promises.push(self.get_stock_orders_by_profile(profile.profile, true))
                    promises.push(self.get_stock_orders_by_profile(profile.profile, false))
                })

                // Execute all promises concurrently and resolve the parsed result
                Promise.all(promises).then((results) => {
                    let filtered_results = results.filter((res_arr) => {
                        return res_arr.length
                    })
                    resolve(filtered_results.flat())
                })
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
     * Returns a list of stock orders from the Stock_Orders and Stock_Simulations tables by
     * their profile AND uuid association in the form of a Promise.
     */
    get_stock_orders_by_profile_at_uuid = (profile, uuid) => {
        const self = this
        return new Promise(function (resolve, reject) {
            self.get_all_stock_orders_where_multi_field_values({
                profile: profile,
                uuid: uuid
            })
                .then((row) => {
                    resolve(row)
                })
        })
    }

    /**
     * Returns a promise after updating Stock_Orders or Stock_Simulations table rows associated with
     * a given profile with field/values object.
     */
    update_stock_orders_by_profile_with_multi_field_values = (profile, simulated, field_values) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        let sql = `UPDATE ${table} SET `
        let end_idx = 0
        let fv_length = Object.keys(field_values).length
        for (const [field, value] of Object.entries(field_values)) {
            sql += `${field} = "${value}"`
            end_idx += 1
            if (end_idx < fv_length) {
                sql += ", "
            } else {
                sql += " "
            }
        }
        sql += `WHERE profile = "${profile}"`
        return new Promise(function (resolve, reject) {
            self.DB.run(sql, function (err) {
                if (err) {
                    console.log(`SMDB: ${table}` + err)
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
     * Returns a promise after updating Stock_Orders or Stock_Simulations table rows associated with
     * a given profile field with field/values object. This function is the same as
     * 'update_stock_orders_by_profile_with_multi_field_values` except it updates any matching rows
     * in both tables.
     */
    update_all_stock_orders_by_profile_with_multi_field_values = (profile, field_values) => {
        const self = this
        return new Promise(function (resolve, reject) {

            // Build promises for results spanning both types of order table (Stock_Orders and Stock_Simulations)
            let promises = []
            promises.push(self.update_stock_orders_by_profile_with_multi_field_values(profile, true, field_values))
            promises.push(self.update_stock_orders_by_uuid_with_multi_field_values(profile, false, field_values))

            // Execute all promises concurrently and resolve the parsed result
            Promise.all(promises).then((results) => {
                let filtered_results = results.filter((res_arr) => {
                    return res_arr.length
                })
                resolve(filtered_results.flat())
            })
        })
    }

    /**
     * Returns a promise after updating Stock_Orders or Stock_Simulations table at associated
     * UUID field with defined fields and values.
     */
    update_stock_orders_by_uuid_with_multi_field_values = (uuid, simulated, field_values) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        let sql = `UPDATE ${table} SET `
        let end_idx = 0
        let fv_length = Object.keys(field_values).length
        for (const [field, value] of Object.entries(field_values)) {
            sql += `${field} = "${value}"`
            end_idx += 1
            if (end_idx < fv_length) {
                sql += ", "
            } else {
                sql += " "
            }
        }
        sql += `WHERE uuid = "${uuid}"`
        return new Promise(function (resolve, reject) {
            self.DB.run(sql, function (err) {
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
     * Returns a promise after updating Stock_Orders or Stock_Simulations table at associated
     * UUID field with defined fields and values. This function is the same as
     * 'update_stock_orders_by_uuid_with_multi_field_values` except it updates any matching rows
     * in both tables.
     */
    update_all_stock_orders_by_uuid_with_multi_field_values = (uuid, field_values) => {
        const self = this
        return new Promise(function (resolve, reject) {

            // Build promises for results spanning both types of order table (Stock_Orders and Stock_Simulations)
            let promises = []
            promises.push(self.update_stock_orders_by_uuid_with_multi_field_values(uuid, true, field_values))
            promises.push(self.update_stock_orders_by_uuid_with_multi_field_values(uuid, false, field_values))

            // Execute all promises concurrently and resolve the parsed result
            Promise.all(promises).then((results) => {
                let filtered_results = results.filter((res_arr) => {
                    return res_arr.length
                })
                resolve(filtered_results.flat())
            })
        })
    }

    /**
     * Deletes all rows in the Stock_Orders or Stock_Simulations tables that correspond to a
     * given profile.
     */
    delete_stock_orders_by_profile = (profile, simulated) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `DELETE FROM ${table} WHERE profile = ?`
            self.DB.run(sql, [profile], function (err) {
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
     * Deletes a row in the Stock_Orders or Stock_Simulations tables that correspond to a
     * given uuid.
     */
    delete_stock_orders_by_uuid = (simulated, uuid) => {
        const self = this
        const table = simulated ? 'Stock_Simulations' : 'Stock_Orders'
        return new Promise(function (resolve, reject) {
            let sql = `DELETE FROM ${table} WHERE uuid = ?`
            self.DB.run(sql, [uuid], function (err) {
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
     * Add an entry to the Stock_Orders_History table.
     */
    add_stock_orders_history_entry = (options) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let uuid, event, info, date = options.date || Date.now();
            ({uuid, event, info} = options)
            let sql = `INSERT INTO Stock_Orders_History (uuid, event, info, date) `
            sql += "VALUES (?, ?, ?, ?) "
            self.DB.run(sql, [uuid, event, info, date], function (err) {
                if (err) {
                    console.log("SMDB: Stock_Orders_History: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: Stock_Orders_History: Last ID: ` + this.lastID)
                    console.log(`SMDB: Stock_Orders_History: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Deletes all rows in Stock_Orders_History that correspond to a given uuid.
     */
    delete_stock_orders_history_by_uuid = (uuid) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `DELETE FROM Stock_Orders_History WHERE uuid = ?`
            self.DB.run(sql, [uuid], function (err) {
                if (err) {
                    console.log("SMDB: Stock_Orders_History: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: Stock_Orders_History: Last ID: ` + this.lastID)
                    console.log(`SMDB: Stock_Orders_History: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Returns a list of rows from Stock_Orders_History that correspond to a given uuid.
     */
    get_stock_orders_history_by_uuid = (uuid) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM Stock_Orders_History WHERE uuid = ? ORDER BY id ASC`
            self.DB.all(sql, [uuid], function (err, rows) {
                if (err) {
                    console.log("SMDB: Stock_Orders_History: " + err)
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
     * Add an entry to the Profiles_History table.
     */
    add_profiles_history_entry = (options) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let profile, event, info, date = options.date || Date.now();
            ({profile, event, info} = options)
            let sql = `INSERT INTO Profiles_History (profile, event, info, date) `
            sql += "VALUES (?, ?, ?, ?) "
            self.DB.run(sql, [profile, event, info, date], function (err) {
                if (err) {
                    console.log("SMDB: Profiles_History: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: Profiles_History: Last ID: ` + this.lastID)
                    console.log(`SMDB: Profiles_History: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Deletes all rows in Profiles_History that correspond to a given profile.
     */
    delete_profiles_history_by_profile = (profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `DELETE FROM Profiles_History WHERE profile = ?`
            self.DB.run(sql, [profile], function (err) {
                if (err) {
                    console.log("SMDB: Profiles_History: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: Profiles_History: Last ID: ` + this.lastID)
                    console.log(`SMDB: Profiles_History: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Returns a promise after updating Profiles_History table rows associated with
     * a given profile with field/values object.
     */
    update_profiles_history_by_profile_with_multi_field_values = (profile, field_values) => {
        const self = this
        let sql = `UPDATE Profiles_History SET `
        let end_idx = 0
        let fv_length = Object.keys(field_values).length
        for (const [field, value] of Object.entries(field_values)) {
            sql += `${field} = "${value}"`
            end_idx += 1
            if (end_idx < fv_length) {
                sql += ", "
            } else {
                sql += " "
            }
        }
        sql += `WHERE profile = "${profile}"`
        return new Promise(function (resolve, reject) {
            self.DB.run(sql, function (err) {
                if (err) {
                    console.log("SMDB: Profiles_History: " + err)
                    reject({success: false})
                } else {
                    console.log(`SMDB: Profiles_History: Last ID: ` + this.lastID)
                    console.log(`SMDB: Profiles_History: # of Row Changes: ` + this.changes)
                    resolve({success: true})
                }
            })
        })
    }

    /**
     * Returns a list of rows from Profiles_History that correspond to a given profile.
     */
    get_profiles_history_by_profile = (profile) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let sql = `SELECT * FROM Profiles_History WHERE profile = ? ORDER BY id DESC`
            self.DB.all(sql, [profile], function (err, rows) {
                if (err) {
                    console.log("SMDB: Profiles_History: " + err)
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

}

module.exports = {
    DBManager: DBManager
}