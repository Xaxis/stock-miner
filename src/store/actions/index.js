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

export const deleteTableRows = (tableProfile, tableID, uuids) => {
    return {
        type: ActionTypes.DELETE_TABLE_ROWS,
        tableProfile: tableProfile,
        tableID: tableID,
        uuids: uuids
    }
}

export const updateTableRows = (tableProfile, tableID, rows) => {
    return {
        type: ActionTypes.UPDATE_TABLE_ROWS,
        tableProfile: tableProfile,
        tableID: tableID,
        rows: rows
    }
}

export const deleteProfileTables = (tableProfile) => {
    return {
        type: ActionTypes.DELETE_PROFILE_TABLES,
        tableProfile: tableProfile
    }
}

export const setSelectedRow = (row) => {
    return {
        type: ActionTypes.SET_SELECTED_ROW,
        row: row
    }
}