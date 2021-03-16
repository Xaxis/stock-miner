import * as ActionTypes from '../actions/action_types'
import {default as UUID} from 'node-uuid'

const templateObjects = {
    tableRow: {
        uuid: '',
        type: '-',
        symbol: '-',
        name: '-',
        price: '-',
        status: '-',
        shares: '-',
        equity: '-',
        change: '-'
    }
}

const initialState = {

    // Single value array containing the active profile name
    profileActive: [],

    // Contains a list of all the available profiles
    profileList: [],

    // Main data store for all trade data across all profiles
    // [Profile:{tables:[tableID:[]]}]
    tableData: [],

    // Contains a list of unique registered UUIDs

    // Contains which trade has been most recently selected
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
         *
         * @todo - !!! This should be broken into TWO functions.
         *  - One that handles adding a new symbol from the Symbol Search
         *  - One that handles adding rows that are being loaded from the database
         */
        case ActionTypes.ADD_TABLE_ROWS:

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
            action.rows.forEach((row) => {

                // Check for existing rows with same UUID
                let existingUUIDS = existingTable[0].tables[action.tableID].filter((existingRows) => {
                    return existingRows.uuid === row.uuid
                })

                // Proceed creating new row object ONLY if it hasn't been added before
                if (!existingUUIDS.length) {

                    // New trade/row object cloned from template
                    let newRowObject = Object.assign({}, templateObjects.tableRow)
                    newRowObject.uuid = row.uuid
                    newRowObject.symbol = row.symbol
                    newRowObject.name = row.name
                    newRowObject.type = row.market
                    newRowObject.price = row.price
                    newRowObject.shares = row.shares
                    newRowObject.status = row.order_type

                    // Add new row object to new rows array
                    newRows.push(newRowObject)
                }
            })

            // Concat new row data to a given table's array
            existingTable[0].tables[action.tableID] = existingTable[0].tables[action.tableID].concat(newRows)
            return {
                ...state,
                tableData: [...state.tableData]
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

            // Update table data on specified table
            tableDataObj.tables[action.tableID] = newTableData
            return {
                ...state,
                tableData: [...state.tableData]
            }

        /**
         * Deletes all table data related to a profile.
         */
        case ActionTypes.DELETE_PROFILE_TABLES:
            let newProfileTables = state.tableData.filter((tableObj) => {
                return tableObj.tableProfile !== action.tableProfile
            })
            return {
                ...state,
                tableData: [...newProfileTables]
            }

        /**
         * Updates data in the table when called.
         */
        case ActionTypes.UPDATE_TABLE_ROWS:
            let profile = state.tableData.filter((profile) => {
                return profile.tableProfile === action.tableProfile
            })
            if (profile.length) {
                let table = profile[0].tables[action.tableID]

                // Iterate over table rows and update data
                if (table) {
                    table.forEach((row) => {
                        action.rows.forEach((data) => {
                            if (data.uuid === row.uuid) {
                                row.price = data.price
                                row.status = data.status
                            }
                        })
                    })
                }
            }

            return {
                ...state,
                tableData: [...state.tableData]
            }

        /**
         * Updates data in the table when called.
         */
        case ActionTypes.UPDATE_TABLE_DATA:
            return {
                ...state,
                tableData: [...state.tableData]
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