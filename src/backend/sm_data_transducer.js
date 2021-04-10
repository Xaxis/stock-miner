/**
 * DataTransducer manages the flow of stream data to and from the database as well as
 * data to and from the client and the data provider.
 *
 * DataTransducer requires access to DBManager and DataProvider instances.
 */
class DataTransducer {

    constructor(DBManager, DataProvider, OrderProcessor) {
        this.DB = DBManager
        this.DP = DataProvider
        this.OP = OrderProcessor
        this.ACTIVE_PROFILE = 'noop'
        this.ACTIVE_PROFILE_TASKS = []
        this.ALL_TASKS = []
        this.TASK_INTERVAL = null
        this.DB.get_config()
            .then((config) => {
                if (config) {
                    this.init_task_interval(config.task_frequency)
                } else {
                    this.init_task_interval(10000)
                }
            })
    }

    /**
     * The task interval is the main loop in which all active profile's orders are operated on. Even
     * if a profile isn't active in the app, if it has been set to 'active' all of its orders/trades
     * will continue to operate in the background.
     */
    init_task_interval = (period) => {
        this.TASK_INTERVAL = setInterval(() => {

            // Update the database with the most recent stream data
            if (this.ALL_TASKS.length) console.log(`SMDT: Executing scheduled tasks for: ${this.ALL_TASKS.length} rows.`)
            this.ALL_TASKS.forEach((task) => {
                let data = this.DP.STREAM_DATA[task.market][task.symbol]
                let set_data = {

                    // Set the current price
                    price: (data) ? data.ap : 0
                }

                // Attempt to update rows in Stock_Simulations and Stock_Orders tables with new data. We attempt
                // to update in both because we don't know in which type of order table the order/row exists.
                this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(task.uuid, set_data)
                    .then(() => {

                        // Retrieve the current task and hand it's associated fields off to the order processor.
                        this.DB.get_all_stock_orders_where_multi_field_values({uuid: task.uuid})
                            .then((row) => {
                                let task_row = row[0]

                                // Proceed when task is not paused.
                                if (task_row.paused === 'false') {
                                    this.OP.process_order(task)
                                }
                            })
                    })
            })
        }, period)
    }

    /**
     * Resets the task interval.
     */
    reset_task_interval = (interval = 10000) => {
        clearInterval(this.TASK_INTERVAL)
        this.init_task_interval(interval)
    }

    /**
     * Builds task objects for all orders (simulated or otherwise) that are associated w/
     * profiles that have their status set to active.
     */
    build_all_active_tasks_from_db = () => {
        this.ALL_TASKS = []
        this.DB.get_stock_orders_by_profile_status('active')
            .then((rows) => {
                rows.forEach((row) => {
                    this.ALL_TASKS.push(
                        Object.assign(row, {
                            uuid: row.uuid,
                            profile: row.profile,
                            market: row.market.toUpperCase(),
                            symbol: row.symbol.toUpperCase()
                        })
                    )
                })
            })
    }

    /**
     * Sets the active stream profile so we know which data the client should receive
     */
    set_active_stream_profile = (profile) => {

        // Reset active profile list and flag
        this.ACTIVE_PROFILE_TASKS = []
        this.ACTIVE_PROFILE = profile
    }

    /**
     * Gets the active stream profile.
     */
    get_active_stream_profile = () => {
        return this.ACTIVE_PROFILE
    }

    /**
     * Returns true if a task is unique and has not already been added to the ACTIVE_PROFILE_TASKS
     * array.
     * @todo - May not need this any longer. Review.
     */
    is_task_unique = (uuid) => {
        return !this.ALL_TASKS.filter((task) => {
            return task.uuid === uuid
        }).length
    }

    /**
     * Returns true if a task is unique and has not already been added to the ACTIVE_PROFILE_TASKS
     * array.
     */
    is_active_task_unique = (uuid) => {
        return !this.ACTIVE_PROFILE_TASKS.filter((task) => {
            return task.uuid === uuid
        }).length
    }

    /**
     * Adds/registers a data stream with the DataProvider and adds/registers a task object w/
     * ACTIVE_PROFILE_TASKS so we know which data to send to the frontend.
     */
    add_active_task = (profile, uuid, market, symbol) => {

        // Register the data stream
        this.DP.register_trade(market, symbol)

        // Add a watcher task
        let task = {
            uuid: uuid,
            profile: profile,
            market: market.toUpperCase(),
            symbol: symbol.toUpperCase()
        }
        this.ACTIVE_PROFILE_TASKS.push(task)
    }

    /**
     * Adds/registers multiple task objects w/ ACTIVE_PROFILE_TASKS.
     */
    add_active_tasks = (rows) => {
        rows.forEach((row) => {
            if (this.is_active_task_unique(row.uuid)) {
                this.add_active_task(
                    row.profile,
                    row.uuid,
                    row.market,
                    row.symbol
                )
            }
        })
    }

    /**
     * Remove/deregister a data stream with the DataProvider and removes/deregisters a task object
     * from ACTIVE_PROFILE_TASKS.
     */
    remove_active_task = (uuid) => {

        // Reference the uuid to delete
        let target_watcher = this.ACTIVE_PROFILE_TASKS.filter((task) => {
            return task.uuid === uuid
        })

        // Proceed when the target task is found
        if (target_watcher.length) {

            // Create new watcher task array
            this.ACTIVE_PROFILE_TASKS = this.ACTIVE_PROFILE_TASKS.filter((task) => {
                return task.uuid !== uuid
            })

            // Are there any other tasks using the same data provider subscription?
            let task_symbol_to_unsubscribe = this.ACTIVE_PROFILE_TASKS.filter((task) => {
                return task.market === target_watcher[0].market && task.symbol === target_watcher[0].symbol
            })

            // De-register/unsubscribe from data provider stream
            if (!task_symbol_to_unsubscribe.length) {
                this.DP.deregister_trade(target_watcher[0].market, target_watcher[0].symbol)
            }
        }
    }

    /**
     * Returns true when a particular data stream object is ready.
     */
    is_data_stream_ready = (market, symbol) => {
        if (!this.DP.STREAM_DATA) {
            return false
        }
        if (!(market in this.DP.STREAM_DATA)) {
            return false
        }
        if (!(symbol in this.DP.STREAM_DATA[market])) {
            return false
        }
        return true
    }

    /**
     * Retrieves sanity checks on the availability of data provider data and assists in building
     * each row object for consumption by the frontend.
     */
    get_parsed_stream_data = (market, symbol) => {
        let stream_data = {
            price: 0
        }
        if (this.is_data_stream_ready(market, symbol)) {
            stream_data.price = this.DP.STREAM_DATA[market][symbol].ap
        }
        return stream_data
    }

    /**
     * Returns a Promise that returns the data object to stream to the client.
     */
    get_data_stream_for_profile = (tableid, profile = this.ACTIVE_PROFILE) => {
        const self = this
        return new Promise(function (resolve, reject) {
            let stream_data = {
                _profile: profile,
                _tableid: tableid,
                promises: [],
                rows: [],
            }

            // Proceed only when profile isn't temporary no-op.
            if (profile !== 'noop') {
                console.log(`SMDT: Sending data for profile (${profile}). ${self.ACTIVE_PROFILE_TASKS.length} rows.`)
                self.ACTIVE_PROFILE_TASKS.forEach((task) => {
                    if (task.profile === profile) {

                        // Merge stream data rows into data object
                        let data_row = Object.assign({
                            uuid: task.uuid
                        }, self.get_parsed_stream_data(task.market, task.symbol))

                        // Add data to rows
                        stream_data.rows.push(data_row)

                        // Add promises to unretrieved database data
                        stream_data.promises.push(self.DB.get_all_stock_orders_where_multi_field_values({uuid: task.uuid}))
                    }
                })

                // Execute all promises concurrently and parse results
                Promise.all(stream_data.promises).then((results) => {

                    // Filter and flatten results array from promises
                    delete stream_data.promises
                    let results_to_merge = results.filter((res_arr) => {
                        return res_arr.length
                    }).flat()

                    // Merge database results with their corresponding stream data objects
                    stream_data.rows = stream_data.rows.map((data_obj, index) => {
                        let row = results_to_merge[index]

                        // console.log(Object.assign(row, data_obj, {
                        //     status: row.paused === 'true' ? 'Paused' : row.status,
                        // }))

                        return Object.assign(row, data_obj, {
                            status: row.paused === 'true' ? 'Paused' : row.status,
                        })
                    })

                    // Resolve the merged results
                    resolve(stream_data)
                })
            }
        })
    }

    /**
     * This function is used to correct the 'Status' data presented to the user in the
     * user interface with the 'status' value indicating the operation of a 'Running' order.
     */
    parse_row_data_status = (rows) => {
        let parsed_rows = rows.map((row) => {
            if (row.paused === 'true') {
                row.status = 'Paused'
            }
            return row
        })
        return parsed_rows
    }
}

module.exports = {
    DataTransducer: DataTransducer
}