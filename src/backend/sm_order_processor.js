/**
 * OrderProcessor manages the execution (buys & sells) of order tasks.
 */
class OrderProcessor {

    constructor(DBManager, RobinhoodHelper) {
        this.DB = DBManager
        this.RH = RobinhoodHelper
        this.RH_LOGGING_IN = false
        this.EXEC_PRICE_MARGIN = 0.99
        this.TASK_ORDER = [
            'LOSS_PREVENT',
            'LIMIT_BUY',
            'BUY',
            'SELL',
            'LIMIT_SELL'
        ]
        this.TASK_PROCEDURES = {

            /**
             * BUY: Buys an order.
             */
            BUY: {
                process: (order, tasks_obj) => {
                    let buy = this.get_order_task_by_event(tasks_obj, 'BUY')
                    let limit_buy = this.get_order_task_by_event(tasks_obj, 'LIMIT_BUY')
                    let sell = this.get_order_task_by_event(tasks_obj, 'SELL')
                    if (
                        !this.is_order_task_done(buy)
                        && !limit_buy
                        && !this.is_order_task_done(sell)
                        && this.is_exec_price_within_margin(order.buy_price, order.price)
                    ) {
                        let self = this

                        // When simulated order
                        if (order.simulated) {
                            this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                                tasks: this.update_order_task_by_event(tasks_obj, 'BUY', {done: true}),
                                exec_date: Date.now()
                            })
                        }

                        // Place actual order
                        // @todo - This is not all the way working, continue on! Do it to it!
                        else if (!order.hasOwnProperty('rh_executing')) {
                            order.rh_executing = true

                            // Get quote directly from Robinhood and enforce execution price is within price margin
                            this.RH.rh_get_quote(order.symbol, order.market).then((quote) => {
                                if (quote.success && self.is_exec_price_within_margin(order.buy_price, quote.price)) {

                                    // Create the order with Robinhood
                                    self.RH.rh_request(`buy/${order.market.toLowerCase()}/${order.symbol}/${order.cost_basis}`)
                                        .then((rh_order) => {
                                            order.rh_updated_at = Date.now()
                                            self.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                                                rh_order_id: rh_order.id
                                            })
                                        })
                                }
                            })
                        }

                        // Fulfill actual orders that are executing once completed with Robinhood
                        // @todo - This is not all the way working, continue on! Do it to it!
                        if (!order.simulated && order.hasOwnProperty('rh_executing')) {

                            // Poll the status of order no more than every 3 seconds
                            if (order.rh_order_id && order.rh_executing && (order.rh_updated_at + 3000 > Date.now())) {
                                order.rh_updated_at = Date.now()

                                console.log('CHECKING IF ORDER IS FULFILLED...', false)

                                this.RH.rh_get_order(order.rh_order_id, order.market)
                                    .then((rh_order) => {
                                        if (rh_order.success) {

                                            // Update DB with filled order data & indicate order is no longer executing
                                            if (rh_order.order.state === 'filled') {
                                                order.rh_executing = false

                                                console.log('ORDER FULFILLED!!!', true)

                                                self.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                                                    cost_basis: parseFloat(rh_order.price) * parseFloat(rh_order.quantity),
                                                    tasks: self.update_order_task_by_event(tasks_obj, 'BUY', {done: true}),
                                                    exec_date: Date.now()
                                                })
                                            }
                                        }
                                    })
                            }
                        }

                        return true
                    }
                    return false
                }
            },

            /**
             * SELL: Sells an order.
             */
            SELL: {
                process: (order, tasks_obj) => {
                    let buy = this.get_order_task_by_event(tasks_obj, 'BUY')
                    let limit_sell = this.get_order_task_by_event(tasks_obj, 'LIMIT_SELL')
                    let sell = this.get_order_task_by_event(tasks_obj, 'SELL')
                    if (
                        !this.is_order_task_done(sell)
                        && !limit_sell
                        && this.is_order_task_done(buy)
                    ) {
                        // @todo - Build complete execution steps
                        this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                            tasks: this.update_order_task_by_event(tasks_obj, 'SELL', {done: true}),
                            exec_date: Date.now()
                        })
                        sell.done = true
                        return true
                    }
                    return false
                }
            },

            /**
             * LIMIT_BUY: Buys an order at value point.
             */
            LIMIT_BUY: {
                process: (order, tasks_obj) => {
                    let buy = this.get_order_task_by_event(tasks_obj, 'BUY')
                    let limit_buy = this.get_order_task_by_event(tasks_obj, 'LIMIT_BUY')
                    let sell = this.get_order_task_by_event(tasks_obj, 'SELL')
                    if (
                        !this.is_order_task_done(limit_buy)
                        && !this.is_order_task_done(sell)
                        && this.is_limit_buy_point_hit(order.price, order.limit_buy)
                        && this.is_exec_price_within_margin(order.limit_buy, order.price)
                    ) {
                        // @todo - Build complete execution steps
                        this.update_order_task_by_event(tasks_obj, 'BUY', {done: true})
                        this.update_order_task_by_event(tasks_obj, 'LIMIT_BUY', {done: true})
                        this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                            tasks: tasks_obj,
                            exec_date: Date.now()
                        })
                        return true
                    }
                    return false
                }
            },

            /**
             * LOSS_SELL: Sells an order at value point.
             */
            LIMIT_SELL: {
                process: (order, tasks_obj) => {
                    let buy = this.get_order_task_by_event(tasks_obj, 'BUY')
                    let limit_sell = this.get_order_task_by_event(tasks_obj, 'LIMIT_SELL')
                    let sell = this.get_order_task_by_event(tasks_obj, 'SELL')
                    if (
                        !this.is_order_task_done(limit_sell)
                        && !this.is_order_task_done(sell)
                        && this.is_order_task_done(buy)
                        && this.is_limit_sell_point_hit(order.price, order.limit_sell)
                    ) {
                        // @todo - Build complete execution steps
                        this.update_order_task_by_event(tasks_obj, 'SELL', {done: true})
                        this.update_order_task_by_event(tasks_obj, 'LIMIT_SELL', {done: true})
                        this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                            tasks: tasks_obj,
                            exec_date: Date.now()
                        })
                        return true
                    }
                    return false
                }
            },

            /**
             * LOSS_PREVENT: Auto sells an order when % loss value point hit.
             */
            LOSS_PREVENT: {
                process: (order, tasks_obj) => {
                    let loss_prevent = this.get_order_task_by_event(tasks_obj, 'LOSS_PREVENT')
                    let buy = this.get_order_task_by_event(tasks_obj, 'BUY')
                    let limit_buy = this.get_order_task_by_event(tasks_obj, 'LIMIT_BUY')
                    let sell = this.get_order_task_by_event(tasks_obj, 'SELL')
                    if (
                        !this.is_order_task_done(loss_prevent)
                        && (this.is_order_task_done(buy) || this.is_order_task_done(limit_buy))
                        && this.is_order_task_done(sell)
                        && this.is_loss_prevent_point_hit(order.buy_price, order.price, order.loss_perc)
                    ) {
                        // @todo - Build complete execution steps
                        this.update_order_task_by_event(tasks_obj, 'SELL', {done: true})
                        this.update_order_task_by_event(tasks_obj, 'LIMIT_SELL', {done: true})
                        this.update_order_task_by_event(tasks_obj, 'LOSS_PREVENT', {done: true})
                        this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                            tasks: tasks_obj,
                            exec_date: Date.now()
                        })
                        return true
                    }
                    return false
                }
            }
        }
    }

    /**
     * The main order processor function. This should be the only method used
     * outside this class.
     */
    process_order = (order) => {

        // Confirm logged in to Robinhood
        let login_expired = this.RH.rh_is_login_expired()
        if (login_expired && !this.RH_LOGGING_IN) {
            this.RH_LOGGING_IN = true
            this.RH.rh_login()
                .then((result) => {
                    if (result) {
                        this.RH_LOGGING_IN = false
                    }
                })
        }

        // Proceed with executing tasks once logged in
        if (!login_expired) {
            let tasks_obj = this.get_order_tasks_object(order)
            this.TASK_ORDER.forEach((event) => {
                let task = this.get_order_task_by_event(tasks_obj, event)
                if (task) {
                    if (this.TASK_PROCEDURES[event].process(order, tasks_obj)) {
                        console.log(`SMOP: Task ${event} is being processed for order: ${order.uuid}`)
                    }
                }
            })
        }
    }

    /**
     * Returns a task object corresponding to a given event and null of not found.
     */
    get_order_task_by_event = (tasks, event) => {
        let result = tasks.filter((task) => {
            return task.event === event
        })
        return result.length ? result[0] : null
    }

    /**
     * Update a task object corresponding to a given event and return the tasks object.
     */
    update_order_task_by_event = (tasks, event, key_values) => {
        tasks.forEach((task) => {
            if (task.event === event) {
                task = Object.assign(task, key_values)
            }
        })
        return tasks
    }

    /**
     * Returns a list of order tasks to perform.
     */
    get_order_tasks_object = (order) => {
        return JSON.parse(order.tasks)
    }

    /**
     * Returns 'true' when a task object's 'done' property is true.
     */
    is_order_task_done = (task) => {
        if (task) {
            if (task.done) {
                return true
            }
        }
        return false
    }

    /**
     * Returns true when a loss prevent percent point has been hit.
     */
    is_loss_prevent_point_hit = (buy_price, current_price, loss_percent) => {
        let clean_buy_price = parseFloat(buy_price)
        let clean_current_price = parseFloat(current_price)
        let change = clean_current_price - clean_buy_price
        let percent_change = ((change / clean_buy_price) * 100)
        return Math.abs(percent_change) >= Math.abs(loss_percent)
    }

    /**
     * Returns true when a limit buy point has been hit.
     */
    is_limit_buy_point_hit = (current_price, limit_price) => {
        return limit_price >= current_price
    }

    /**
     * Returns true when a limit sell point has been hit.
     */
    is_limit_sell_point_hit = (current_price, limit_price) => {
        return limit_price <= current_price
    }

    /**
     * Is acceptable execution margin percent? When an order is being executed, it is
     * intended to execute (buy or sell) at a given price. The price it actually executes
     * at will rarely if ever be that 'buy_price' due to the ever changing volatility
     * of the market. To overcome this orders must be executed within an acceptable margin
     * +/- % of the intended buy price.
     */
    is_exec_price_within_margin = (buy_price, current_price, margin=this.EXEC_PRICE_MARGIN) => {
        let clean_current_price = parseFloat(current_price)
        let clean_buy_price = parseFloat(buy_price)
        let change = clean_current_price - clean_buy_price
        let percent_change = Math.abs(((change / clean_buy_price) * 100))
        return percent_change <= margin
    }

    /**
     * Method uses the Stock Miner Flask server to perform REST requests to Robinhood. Returns
     * a Promise with result on success.
     */
    rh_request = (url) => {
        return new Promise(function (resolve, reject) {
            Request(`http://127.0.0.1/app/rh/${url}`, {json: true}, (err, res, body) => {
                if (err) {
                    console.log('SMOP: Error: ', err)
                    reject(err)
                }
                resolve(body)
            })
        })
    }
}

module.exports = {
    OrderProcessor: OrderProcessor
}