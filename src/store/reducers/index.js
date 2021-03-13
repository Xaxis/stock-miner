import * as ActionTypes from '../actions/action_types'
import {default as UUID} from 'node-uuid'

const templateObjects = {
    tableRow: {uuid: '', type: '-', symbol: '-', price: '-', status: '-', shares: '-', equity: '-', change: '-'},
    registeredTrade: {uuid: '', symbol: '', type: ''}
}

const initialState = {
    profileActive: [],
    profileList: [],
    tableData: [],
    registeredTrades: [],
    newRegisteredTrades: [],
    registeredTradesToDelete: [],
    currentSelectedTrade: null
}

const Reducers = (state = initialState, action) => {
    switch (action.type) {

        /**
         * Set active profile.
         */
        case ActionTypes.SET_PROFILE_ACTIVE:
            return {
                ...state,
                profileActive: action.active
            }

        /**
         * Set profile list.
         */
        case ActionTypes.SET_PROFILE_LIST:
            return {
                ...state,
                profileList: action.list
            }

        /**
         * Adds new row(s) of data to a data table.
         */
        case ActionTypes.ADD_TABLE_ROW:

            // Look for existing table data object
            let existingTable = state.tableData.filter((tableObj) => {
                return tableObj.tableProfile === action.tableProfile
            })

            // If table object doesn't exist yet, create it
            if (!existingTable.length) {
                let newTableObj = {
                    tableProfile: action.tableProfile,
                    tables: []
                }
                newTableObj.tables[action.tableID] = []
                existingTable.push(newTableObj)
                state.tableData.push(newTableObj)
            }

            // If table data array at a given tableID doesn't exist, create it
            if (!(existingTable[0].tables.hasOwnProperty(action.tableID))) {
                existingTable[0].tables[action.tableID] = []
            }

            // Add new rows to specified table's table data
            let newRows = []
            let newRegisteredTrades = []
            action.rows.forEach((row) => {

                // Add new row object to table data
                let newRowObject = Object.assign({}, templateObjects.tableRow)
                newRowObject.uuid = UUID.v4()
                newRowObject.symbol = row.s
                newRowObject.type = row.t
                newRows.push(newRowObject)

                // Create and add matching registered trade object to registeredTrades
                let newRegisteredTradeObject = Object.assign({}, templateObjects.registeredTrade)
                newRegisteredTradeObject.tableID = action.tableID
                newRegisteredTradeObject.uuid = newRowObject.uuid
                newRegisteredTradeObject.symbol = newRowObject.symbol
                newRegisteredTradeObject.type = row.t
                newRegisteredTrades.push(newRegisteredTradeObject)
            })

            // Concat new row data to a given table's array
            existingTable[0].tables[action.tableID] = existingTable[0].tables[action.tableID].concat(newRows)
            return {
                ...state,
                tableData: [...state.tableData],
                registeredTrades: state.registeredTrades.concat(newRegisteredTrades),
                newRegisteredTrades: newRegisteredTrades
            }

        /**
         * Deletes row(s) of data from a data table.
         */
        case ActionTypes.DELETE_TABLE_ROW:
            let tableDataObj = state.tableData.filter((tableObj) => {
                return tableObj.tableProfile === action.tableProfile
            })[0]

            // What the new table will look like
            let newTableData = tableDataObj.tables[action.tableID].filter((row) => {
                return action.uuids.indexOf(row.uuid) <= -1
            })

            // Also update the corresponding registered trades object
            let newRegisteredTradesData = state.registeredTrades.filter((row) => {
                return action.uuids.indexOf(row.uuid) <= -1
            })

            // Update which trades in the table are to be removed on the server
            let oldRegisteredTradesData = state.registeredTrades.filter((row) => {
                return action.uuids.indexOf(row.uuid) > -1
            })

            // Update table data on specified table
            tableDataObj.tables[action.tableID] = newTableData
            return {
                ...state,
                tableData: [...state.tableData],
                registeredTrades: newRegisteredTradesData,
                registeredTradesToDelete: oldRegisteredTradesData
            }

        /**
         * Updates data in the table when called.
         */
        case ActionTypes.UPDATE_TABLE_DATA:
            return {
                ...state,
                tableData: [...state.tableData],
                registeredTrades: state.registeredTrades,
                registeredTradesToDelete: state.registeredTradesToDelete
            }

        /**
         * Set the most recently selected trade object.
         */
        case ActionTypes.SET_SELECTED_TRADE:
            return {
                ...state,
                currentSelectedTrade: action.row
            }

        /**
         * Returns default state upon no action call.
         */
        default:
            return state
    }
}

export default Reducers