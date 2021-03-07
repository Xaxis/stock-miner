import * as ActionTypes from '../actions/action_types'
import {default as UUID} from 'node-uuid'

const templateObjects = {
    tableRow: {uuid: '', type: '-', symbol: '-', price: '-', status: '-', shares: '-', equity: '-', change: '-'},
    registeredTrade: {uuid: '', symbol: '', type: ''}
}

const initialState = {
    tableData: [],
    registeredTrades: [],
    newRegisteredTrades: [],
    registeredTradesToDelete: []
}

const Reducers = (state = initialState, action) => {
    switch (action.type) {

        /**
         * Adds new row(s) of data to a data table.
         */
        case ActionTypes.ADD_TABLE_ROW:

            // If a Table's identifier doesn't exist, create a new array for that table
            if (!(action.tableID in initialState.tableData)) {
                state.tableData[action.tableID] = []
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

            // Update table data on specified table
            state.tableData[action.tableID] = state.tableData[action.tableID].concat(newRows)
            return {
                ...state,
                tableData: state.tableData,
                registeredTrades: state.registeredTrades.concat(newRegisteredTrades),
                newRegisteredTrades: newRegisteredTrades
            }

        /**
         * Deletes row(s) of data from a data table.
         */
        case ActionTypes.DELETE_TABLE_ROW:

            // What the new table will look like
            let newTableData = state.tableData[action.tableID].filter((row) => {
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
            state.tableData[action.tableID] = newTableData
            return {
                ...state,
                tableData: state.tableData,
                registeredTrades: newRegisteredTradesData,
                registeredTradesToDelete: oldRegisteredTradesData
            }

        /**
          * Updates data in the table when called.
          * @todo - Updates streaming data but buggy!!!
          */
        case ActionTypes.UPDATE_TABLE_DATA:
            state.tableData[action.tableID] = action.updatedTableData
            return {
                ...state,
                tableData: [...state.tableData],
                registeredTrades: state.registeredTrades,
                registeredTradesToDelete: state.registeredTradesToDelete
            }


        /**
         * Returns default state upon no action call.
         */
        default:
            return state
    }
}

export default Reducers