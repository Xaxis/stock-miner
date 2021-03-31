/**
 * Convert a money value to a presentable money string.
 */
export const toMoneyString = (value) => {
    if (value >= 0) {
        return '$' + value.toString()
    } else {
        return '-$' + value.toString().replace('-', '')
    }
}

/**
 * Convert a percent value to a presentable percent string.
 */
export const toPercentString = (value) => {
    if (value >= 0) {
        return '+' + (value.toFixed(2).toString()) + '%'
    } else {
        return (value.toFixed(2).toString()) + '%'
    }
}

/**
 * Convert a money string to a clean float value. Passing 'novalue' as true
 * returns the cleaned value as a string.
 */
export const toMoneyValue = (string, novalue=false) => {
    let value = string.toString().replace(/[^0-9.]/g, '')
    return novalue ? value : parseFloat(value)
}

/**
 * Convert a percent string to a clean float value. Passing 'novalue' as true
 * returns the cleaned value as a string.
 */
export const toPercentValue = (string, novalue=false) => {
    let value = string.toString().replace(/[^0-9.\-\+]/g, '')
    return novalue ? value : parseFloat(value)
}

/**
 * Calculate percentage of one value into another.
 */
export const calcPercent = (x, y) => {
    let p = parseFloat(x) / parseFloat(y)
    return (!isNaN(p) && isFinite(p) ? p : 0) * 100
}

/**
 * Calculate equity. The 'equity' is the total 'cost_basis' +/- the change of
 * value of a given stock.
 */
export const calcEquity = (cost_basis, purchase_price, current_price) => {
    let percent_change = (calcPercent(current_price, purchase_price) - 100)
    let amount_change = parseFloat(cost_basis) * (percent_change / 100)
    return (cost_basis + amount_change)
}

/**
 * Calculate quantity. The 'quantity' is the number of shares held based on the
 * current equity and the price of a given stock.
 */
export const calcQuantity = (equity_val, current_price) => {
    let clean_equity_val = toMoneyValue(equity_val)
    let clean_current_price = toMoneyValue(current_price)
    let q = clean_equity_val / clean_current_price
    return (!isNaN(q) && isFinite(q) ? q : 0).toFixed(8)
}

/**
 * Calculate total return. The 'total return' is the difference in equity and the
 * purchase price.
 */
export const calcTotalReturn = (equity_val, cost_basis) => {
    return (equity_val - parseFloat(cost_basis)).toFixed(2)
}

/**
 * Calculate the total percent change of the purchase price relative to the current price
 * of a share.
 */
export const calcTotalChange = (purchase_price, current_price) => {
    let percent_change = calcPercent(current_price, purchase_price)
    if (percent_change === 0) {
        return 0
    } else {
        let percent_diff = percent_change - 100
        return percent_diff
    }
}