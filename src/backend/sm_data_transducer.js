/**
 * DataTransducer manages the flow of stream data to and from the database.
 * DataTransducer requires access to DBManager instance and a DataProvider instance
 * in order to access, manipulate, and save streamed data.
 */
class DataTransducer {

    constructor(DBManager, DataProvider) {
        this.DB = DBManager
        this.DP = DataProvider
        this.WATCHER_TASKS = []
        this.WATCHER_INTERVAL = this.set_watcher_interval()
        this.WATCHER = this.init_watcher_interval()
    }

    /**
     * The interval watcher is the main loop in which all transducer watcher tasks are executed
     * at a set interval.
     */
    init_watcher_interval = () => {
        return setInterval(() => {

            // Update the database with the most recent stream data
            this.WATCHER_TASKS.forEach((task) => {
                let data = this.DP.STREAM_DATA[task.market][task.symbol]
                this.DB.update_stock_orders_by_uuid_with_multi_field_values(
                    task.uuid,
                    task.simulated,
                    {

                        // Set the Ask price
                        price: data.ap
                    }
                )
            })
        }, 5000)
    }

    /**
     * Sets the watcher's interval. Exposes setting this property to the class instance.
     */
    set_watcher_interval = (interval = 5000) => {
        return interval
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
}

module.exports = {
    DataTransducer: DataTransducer
}