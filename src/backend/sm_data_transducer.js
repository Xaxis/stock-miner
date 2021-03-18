/**
 * DataTransducer manages the flow of stream data to and from the database as well as
 * data to and from the client and the data provider.
 *
 * DataTransducer requires access to DBManager instance and a DataProvider instance
 * in order to access, manipulate, and save streamed data.
 */
class DataTransducer {

    constructor(DBManager, DataProvider) {
        this.DB = DBManager
        this.DP = DataProvider
        this.ACTIVE_PROFILE = 'noop'
        this.ACTIVE_PROFILE_LAST = 'noop'
        this.ACTIVE_PROFILE_TASKS = []
        this.ALL_TASKS = []
        this.TASK_INTERVAL = this.init_task_interval(10000)
    }

    /**
     * The task interval is the main loop in which all active profile's orders are operated on. Even
     * if a profile isn't active in the app, if it has been set to 'active' all of its orders/trades
     * will continue to operate in the background.
     */
    init_task_interval = (period, load = false) => {
        return setInterval(() => {

            console.log(this.ALL_TASKS)

            // Update the database with the most recent stream data
            if (this.ALL_TASKS.length) console.log(`SMDT: Executing scheduled tasks for: ${this.ALL_TASKS.length} rows.`)
            this.ALL_TASKS.forEach((task) => {
                let data = this.DP.STREAM_DATA[task.market][task.symbol]
                let set_data = {

                    // Set the Ask price
                    price: (data) ? data.ap : -1
                }

                // Attempt to update rows in Stock_Simulations and Stock_Orders tables with new data. We attempt
                // to update in both because we don't know in which type of order table the order/row exists.
                this.DB.update_stock_orders_by_uuid_with_multi_field_values(task.uuid, true, set_data)
                this.DB.update_stock_orders_by_uuid_with_multi_field_values(task.uuid, false, set_data)
            })
        }, period)
    }

    /**
     * Resets the task interval.
     */
    reset_task_interval = (interval = 10000) => {
        clearInterval(this.TASK_INTERVAL)
        this.TASK_INTERVAL = this.init_task_interval(interval, true)
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
                    this.ALL_TASKS.push({
                        uuid: row.uuid,
                        profile: row.profile,
                        market: row.market.toUpperCase(),
                        symbol: row.symbol.toUpperCase()
                    })
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
     * Returns true if the profile has changed and updates the active profile flags.
     */
    has_active_stream_profile_changed = (profile) => {
        if (profile !== this.ACTIVE_PROFILE_LAST && profile !== 'noop') {
            this.ACTIVE_PROFILE_LAST = profile
            return true
        } else {
            return false
        }
    }

    /**
     * Returns true if a task is unique and has not already been added to the ACTIVE_PROFILE_TASKS
     * array.
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

        // Add to the all tasks array
        if (this.is_task_unique(uuid)) {
            this.ALL_TASKS.push(task)
        }
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
     * Return a reference to the realtime stream data related to a given profile.
     */
    get_data_stream_for_profile = (tableid, profile = this.ACTIVE_PROFILE) => {
        let stream_data = {
            _profile: profile,
            _tableid: tableid,
            rows: []
        }
        console.log(`SMDT: Sending data for profile (${profile}). ${this.ACTIVE_PROFILE_TASKS.length} rows.`)
        if (profile !== 'noop') {
            this.ACTIVE_PROFILE_TASKS.forEach((task) => {
                if (task.profile === profile) {

                    // @todo - Check if each data stream object exists before assigning to object
                    stream_data.rows.push({
                        uuid: task.uuid,
                        price: this.DP.STREAM_DATA[task.market][task.symbol].bp,
                        status: 'Active'
                    })
                }
            })
        }
        return stream_data
    }
}

module.exports = {
    DataTransducer: DataTransducer
}