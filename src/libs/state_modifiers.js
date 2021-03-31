/**
 ** This file contains common functions used to modify the state of
 ** of the application. The application's state is otherwise managed
 ** via the Redux 'store'.
 **/

/**
 * Returns a reference to a row in tableData by UUID and null if not found.
 * @param uuid {String} The UUID string to search for.
 * @param data {Array} A reference to the tableData array.
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