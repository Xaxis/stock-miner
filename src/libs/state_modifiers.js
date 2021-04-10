/**
 ** This file contains common functions used to modify the state of
 ** of the application. The application's state is otherwise managed
 ** via the Redux 'store'.
 **/

/**
 * Returns a reference to a row in tableData by UUID and null if not found.
 */
export const getRowDataByUUID = (uuid, data) => {
    let result = null
    if (data.length) {
        data.forEach((profile) => {
            profile.tables.forEach((table) => {
                let row = table.filter((row) => {
                    return row.uuid === uuid
                })
                if (row.length) {
                    result = row[0]
                }
            })
        })
        return result
    } else {
        return null
    }
}

/**
 * Returns a list of default key value pairs in the mui datatable columns.
 * Note - These values must be in the same order as the mui datatable columns.
 */
export const getTableColumnsDefaultValues = () => {
    return [
        ['uuid', ''],
        ['market', ''],
        ['symbol', ''],
        ['name', ''],
        ['price', 0],
        ['cost_basis', 0],
        ['purchase_price', 0],
        ['equity', 0],
        ['limit_buy', 0],
        ['limit_sell', 0],
        ['loss_perc', 0],
        ['status', ''],
        ['paused', 'false'],
        ['tasks', '[]']
    ]
}

/**
 * Returns a row object template (used in the mui datatable).
 */
export const getRowTemplateObject = () => {
    let key_values = [
        ...getTableColumnsDefaultValues()
    ]
    return Object.fromEntries(key_values)
}

/**
 * Returns the mui datatable row array as an object with its associated keys.
 */
export const makeRowObject = (row_arr) => {
    let key_values = getTableColumnsDefaultValues().map((pair, index) => {
        pair[1] = row_arr[index]
        return pair
    })
    return Object.fromEntries(key_values)
}