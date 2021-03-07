import * as ActionTypes from './action_types'

export const addTableRow = (tableID, rows) => {
    return {
        type: ActionTypes.ADD_TABLE_ROW,
        tableID: tableID,
        rows: rows
    }
}

export const deleteTableRow = (tableID, uuids) => {
    return {
        type: ActionTypes.DELETE_TABLE_ROW,
        tableID: tableID,
        uuids: uuids
    }
}