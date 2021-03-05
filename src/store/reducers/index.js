import * as ActionTypes from '../actions/action_types'
import {default as UUID} from 'node-uuid'

const templateObjects = {
    tableRow: {uuid: '', symbol: '-', price: '-', status: '-', shares: '-', equity: '-', change: '-'},
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
            let newRows = []
            let newRegisteredTrades = []
            action.rows.forEach((row) => {

                // Add new row object to table data
                let newRowObject = Object.assign({}, templateObjects.tableRow)
                newRowObject.uuid = UUID.v4()
                newRowObject.symbol = row.s
                newRows.push(newRowObject)

                // Create and add matching registered trade object to registeredTrades
                let newRegisteredTradeObject = Object.assign({}, templateObjects.registeredTrade)
                newRegisteredTradeObject.uuid = newRowObject.uuid
                newRegisteredTradeObject.symbol = newRowObject.symbol
                newRegisteredTradeObject.type = row.t
                newRegisteredTrades.push(newRegisteredTradeObject)
            })
            return {
                ...state,
                tableData: state.tableData.concat(newRows),
                registeredTrades: state.registeredTrades.concat(newRegisteredTrades),
                newRegisteredTrades: newRegisteredTrades
            }

        /**
         * Deletes row(s) of data from a data table.
         */
        case ActionTypes.DELETE_TABLE_ROW:
            let newTableData = state.tableData.filter((row) => {
                return action.uuids.indexOf(row.uuid) <= -1
            })
            let newRegisteredTradesData = state.registeredTrades.filter((row) => {
                return action.uuids.indexOf(row.uuid) <= -1
            })
            let oldRegisteredTradesData = state.registeredTrades.filter((row) => {
                return action.uuids.indexOf(row.uuid) > -1
            })
            return {
                ...state,
                tableData: newTableData,
                registeredTrades: newRegisteredTradesData,
                registeredTradesToDelete: oldRegisteredTradesData
            }


        /**
         * Returns default state upon no action call.
         */
        default:
            return state
    }
}

export default Reducers