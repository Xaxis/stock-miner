/**
 * OrderProcessor manages the execution (buys & sells) of order tasks.
 */
class OrderProcessor {

    constructor(DBManager) {
        this.DB = DBManager
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
                        // @todo - Build complete execution steps
                        this.DB.update_all_stock_orders_by_uuid_with_multi_field_values(order.uuid, {
                            tasks: this.update_order_task_by_event(tasks_obj, 'BUY', {done: true}),
                            exec_date: Date.now()
                        })
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
    is_exec_price_within_margin = (buy_price, current_price, margin=0.99) => {
        let clean_current_price = parseFloat(current_price)
        let clean_buy_price = parseFloat(buy_price)
        let change = clean_current_price - clean_buy_price
        let percent_change = Math.abs(((change / clean_buy_price) * 100))
        return percent_change <= margin
    }
}

module.exports = {
    OrderProcessor: OrderProcessor
}