/**
 ** This file contains functions used to convert and modify values.
 **/

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
 * Converts a money value to a "beautiful" money string, including commas.
 * @todo - Experimental. Refine and eventually use a method like this.
 */
export const toBeautifulMoneyString = (value) => {
    value = value.toString().replace('$', '').replace(',', '')
    return new Intl.NumberFormat().format(parseFloat(value))
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
 * Convert a money string to a clean value.
 */
export const toMoneyValue = (string) => {
    let value = string.toString().replace(/\$/g, '').replace(/[^0-9.]|\.(?=.*\.)/g, '')
    return value
}

/**
 * Convert a percent string to a clean value.
 */
export const toPercentValue = (string) => {
    let value = string.toString().replace('%', '').replace(/[^\+0-9.-]|\.(?=.*\.)/g, '')
    return value
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

/**
 * Takes array of DataTable rows and prepares/parses them further for display in a DataTable.
 */
export const prepareDataTableValues = (rows) => {
    return rows.map((row) => {
        return Object.assign(row, {
            price: toMoneyString(row.price),
            equity: toMoneyString(calcEquity(row.cost_basis, row.purchase_price, row.price).toFixed(2)),
            limit_buy: toMoneyString(row.limit_buy),
            limit_sell: toMoneyString(row.limit_sell),
            loss_perc: row.loss_perc + '%'
        })
    })

}

/**
 * Replaces a strings tokens with values provided in passed array.
 */
export const convertTemplateString = (string, tokens) => {
    tokens.forEach((token, i) => {
        string = string.replace(new RegExp("\\{"+i+"\\}", "g"), tokens[i])
    })
    return string
}