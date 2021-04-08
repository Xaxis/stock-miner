/**
 * OrderProcessor manages the execution (buys & sells) of order tasks.
 */
class OrderProcessor {

    constructor(DBManager) {
        this.DB = DBManager
        this.TASK_ORDER = [
            'LIMIT_BUY',
            'BUY',
            'LOSS_PREVENT',
            'SELL',
            'LIMIT_SELL'
        ]
        this.TASK_EXECUTION_PROCEDURE = [

            // 1. - LIMIT_BUY if task exists (if/when limit point is reached)
            {
                event: 'LIMIT_BUY',
                rules: []
            },

            // 2. - BUY if LIMIT_BUY task does not exist (at price or acceptable tolerance percentage)
            {
                event: 'BUY',
                rules: [
                    ['LIMIT_BUY', false]
                ]
            },

            // 3. - LOSS_PREVENT (sell) if loss percentage is hit (if BUY or LIMIT_BUY tasks complete)
            {
                event: 'LOSS_PREVENT',
                rules: [
                    ['BUY', true],
                    ['LIMIT_BUY', true]
                ]
            },

            // 4. - LIMIT_SELL - ...
            {
                event: 'LIMIT_SELL',
                rules: [
                    ['BUY', true],
                    ['LIMIT_BUY', true]
                ]
            },
        ]
    }

    /**
     * The main order processor function. This should be the only method used
     * outside this class.
     * @todo - Under Construction!!!
     */
    process_order = (order) => {
        let tasks_obj = this.get_order_tasks_object(order)

        // Process tasks in correct order
        this.TASK_ORDER.forEach((event) => {
            let task = this.get_order_task_by_event(tasks_obj, event)
            if (task) {
                console.log(task)
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
        return result.length ? result : null
    }

    /**
     * Returns a list of order tasks to perform.
     */
    get_order_tasks_object = (order) => {
        return JSON.parse(order.tasks)
    }

    /**
     * Returns true when a loss prevent percent point has been hit.
     */
    is_loss_prevent_point_hit = (purchase_price, current_price, loss_percent) => {
        let percent_point = ((parseFloat(purchase_price) / parseFloat(current_price)) * 100).toFixed(2)
        return percent_point >= parseFloat(loss_percent)
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
}

module.exports = {
    OrderProcessor: OrderProcessor
}