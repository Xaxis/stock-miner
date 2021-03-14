import * as ActionTypes from './action_types'

export const setProfileActive = (active) => {
    return {
        type: ActionTypes.SET_PROFILE_ACTIVE,
        active: active
    }
}

export const setProfileList = (list) => {
    return {
        type: ActionTypes.SET_PROFILE_LIST,
        list: list
    }
}

export const addTableRows = (tableProfile, tableID, rows) => {
    return {
        type: ActionTypes.ADD_TABLE_ROWS,
        tableProfile: tableProfile,
        tableID: tableID,
        rows: rows
    }
}

export const deleteTableRow = (tableProfile, tableID, uuids) => {
    return {
        type: ActionTypes.DELETE_TABLE_ROW,
        tableProfile: tableProfile,
        tableID: tableID,
        uuids: uuids
    }
}

export const updateTableData = () => {
    return {
        type: ActionTypes.UPDATE_TABLE_DATA
    }
}

export const setSelectedTrade = (row) => {
    return {
        type: ActionTypes.SET_SELECTED_TRADE,
        row: row
    }
}