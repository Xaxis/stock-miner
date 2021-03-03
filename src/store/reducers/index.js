import * as ActionTypes from '../actions/action_types'

const initialState = {
    tableRowTemplate: {id: 0, symbol: '-', price: 0, status: '-', shares: '-', equity: '-', change: '-'},
    tableData: []
}

const items = (state = initialState, action) => {
    switch (action.type) {

        /**
         * Adds a new row of data to the data table.
         */
        case ActionTypes.ADD_TABLE_ROW:
            let newRows = []
            action.rows.forEach((row) => {
                let newRowObject = Object.assign({}, state.tableRowTemplate)
                newRowObject.id = Date.now()
                newRowObject.symbol = row.s
                newRows.push(newRowObject)
            })
            return {
                ...state,
                tableData: state.tableData.concat(newRows)
            }

        default:
            return state
    }
}

export default items