import * as ActionTypes from '../actions/action_types'
import {default as UUID} from 'node-uuid'

const initialState = {
    tableRowTemplate: {uuid: 0, symbol: '-', price: 0, status: '-', shares: '-', equity: '-', change: '-'},
    tableData: []
}

const Reducers = (state = initialState, action) => {
    switch (action.type) {

        /**
         * Adds new row(s) of data to a data table.
         */
        case ActionTypes.ADD_TABLE_ROW:
            let newRows = []
            action.rows.forEach((row) => {
                let newRowObject = Object.assign({}, state.tableRowTemplate)
                newRowObject.uuid = UUID.v4()
                newRowObject.symbol = row.s
                newRows.push(newRowObject)
            })
            return {
                ...state,
                tableData: state.tableData.concat(newRows)
            }

        /**
         * Deletes row(s) of data from a data table.
         */
        case ActionTypes.DELETE_TABLE_ROW:
            let newTableData = state.tableData.filter((row) => {
                return action.uuids.indexOf(row.uuid) > -1 ? false : true
            })
            state.tableData = newTableData

        default:
            return state
    }
}

export default Reducers