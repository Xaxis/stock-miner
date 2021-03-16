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
        this.WATCHER_TASKS = []
        this.WATCHER_INTERVAL = this.set_watcher_interval()
        this.WATCHER = this.init_watcher_interval()
    }

    /**
     * The interval watcher is the main loop in which all transducer watcher tasks are executed
     * at an interval.
     */
    init_watcher_interval = () => {
        return setInterval(() => {
            // let profile_changed = this.is_active_stream_profile_changed(this.ACTIVE_PROFILE, this.ACTIVE_PROFILE_LAST)

            // Update the database with the most recent stream data
            if (this.WATCHER_TASKS.length) console.log('SM: Data Transducer: Updating trades with new data.')
            this.WATCHER_TASKS.forEach((task) => {
                let data = this.DP.STREAM_DATA[task.market][task.symbol]
                this.DB.update_stock_orders_by_uuid_with_multi_field_values(
                    task.uuid,
                    task.simulated,
                    {

                        // Set the Ask price
                        price: (data) ? data.ap : -1
                    }
                )
            })
        }, this.WATCHER_INTERVAL)
    }

    /**
     * Sets the watcher's interval. Exposes setting this property to the class instance.
     */
    set_watcher_interval = (interval = 10000) => {
        return interval
    }

    /**
     * Sets the active stream profile so we know which data the client should receive and
     * removes all watcher tasks.
     */
    set_active_stream_profile = (profile) => {
        this.WATCHER_TASKS = []
        this.ACTIVE_PROFILE = profile
    }

    /**
     * Returns true if the profile has changed and updates the active profile flags.
     */
    is_active_stream_profile_changed = (profile) => {
        if (profile !== this.ACTIVE_PROFILE_LAST && profile !== 'noop') {
            this.ACTIVE_PROFILE_LAST = profile
            return true
        } else {
            return false
        }
    }

    /**
     * Returns true if a watcher task has not already been added to the WATCHER_TASKS
     * object list.
     */
    is_watcher_task_unique = (uuid) => {
        return !this.WATCHER_TASKS.filter((task) => {
            return task.uuid === uuid
        }).length
    }

    /**
     * Adds/registers a data stream with the DataProvider and adds/registers a "watcher"
     * that updates pertinent data with associated trades in the database.
     */
    add_data_stream_watcher = (profile, uuid, market, symbol, simulated = true) => {

        // Register the data stream
        this.DP.register_trade(market, symbol)

        // Add a watcher
        let watcher = {
            uuid: uuid,
            profile: profile,
            market: market.toUpperCase(),
            symbol: symbol.toUpperCase(),
            simulated: simulated
        }
        this.WATCHER_TASKS.push(watcher)
    }

    /**
     * Adds/registers multiple data stream watcher tasks.
     */
    add_data_stream_watchers = (rows, simulated) => {
        rows.forEach((row) => {
            if (this.is_watcher_task_unique(row.uuid)) {
                this.add_data_stream_watcher(
                    row.profile,
                    row.uuid,
                    row.market,
                    row.symbol,
                    simulated
                )
            }
        })
    }

    /**
     * Remove/deregister a data stream watcher object and unsubscribe from provider
     * channel.
     * @todo - Build this!
     */
    remove_data_stream_watcher = (market, symbol) => {

        // De-register the data stream
        this.DP.deregister_trade(market, symbol)
    }

    /**
     * Return a referenced to the realtime stream data related to a given profile.
     */
    get_data_stream_for_profile = (tableid, profile = this.ACTIVE_PROFILE) => {
        let stream_data = {
            _profile: profile,
            _tableid: tableid,
            rows: []
        }
        console.log(`SM: Data Transducer: Sending data for profile (${profile}). ${this.WATCHER_TASKS.length} rows.`)
        if (profile !== 'noop') {
            this.WATCHER_TASKS.forEach((task) => {
                if (task.profile === profile) {
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