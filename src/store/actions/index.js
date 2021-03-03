import * as ActionTypes from './action_types'

export const addTableRow = (rows) => {
    return {
        type: ActionTypes.ADD_TABLE_ROW,
        rows: rows
    }
}

export const deleteTableRow = () => {
    return {
        type: ActionTypes.DELETE_TABLE_ROW
    }
}

export const setError = () => {
    return {
        type: ActionTypes.SET_ERROR
    }
}