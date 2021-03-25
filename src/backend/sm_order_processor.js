/**
 * OrderProcessor manages the execution (buys & sells) of order tasks.
 */
class OrderProcessor {

    constructor(DBManager) {
        this.DB = DBManager
    }

    /**
     * The main order processor function. This should be the only method used
     * outside this class.
     */
    process_order = (order) => {
        // console.log('Do Order Processing Here!', order)
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