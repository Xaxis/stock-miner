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

/**
 * Returns a task object from the tasks list by its event name. If task not
 * found returns null.
 */
export const getTask = (tasks, task_name) => {
    let target_task = null
    if (tasks) {
        target_task = tasks.filter((task) => {
            return task_name === task.event
        })
        if (target_task.length) {
            return target_task[0]
        } else {
            return null
        }
    }
    return target_task
}

/**
 * Returns true if a task is found and is done.
 */
export const isTaskDone = (tasks, task_name) => {
    let task = getTask(tasks, task_name)
    if (task) {
        return task.done === true
    } else {
        return false
    }
}