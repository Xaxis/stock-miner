import * as ActionTypes from '../actions/action_types'

const templateObjects = {
    tableRow: {
        _meta: {},
        uuid: '',
        market: '-',
        symbol: '-',
        name: '-',
        price: '-',
        status: '-',
        limit_buy: 0,
        limit_sell: 0
    }
}

const initialState = {

    // Single value array containing the active profile name
    profileActive: [],

    // Contains a list of all the available profiles
    profileList: [],

    // Active table ID
    tableIDActive: 0,

    // Active table type
    tableTypeActive: 'simulated',

    // Main data store for all trade data across all profiles
    // [Profile:{tables:[tableID:[]]}]
    tableData: [],

    // Holds the current selected row object
    currentSelectedRow: null,

    // Holds the current selected row's index
    currentSelectedRowIndex: []
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
                    newRowObject.market = row.market
                    newRowObject.price = row.price
                    newRowObject.status = row.status
                    newRowObject.limit_buy = row.limit_buy
                    newRowObject.limit_sell = row.limit_sell
                    newRowObject._meta = row

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
        case ActionTypes.DELETE_TABLE_ROWS:
            let deleteProfileObj = state.tableData.filter((profile) => {
                return profile.tableProfile === action.tableProfile
            })
            if (deleteProfileObj.length) {
                let table = deleteProfileObj[0].tables[action.tableID]

                // Iterate over table and delete matching rows
                if (table) {
                    let newTableData = table.filter((row) => {
                        return action.uuids.indexOf(row.uuid) <= -1
                    })
                    deleteProfileObj[0].tables[action.tableID] = newTableData
                }
            }
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
            let updateProfileObj = state.tableData.filter((profile) => {
                return profile.tableProfile === action.tableProfile
            })
            if (updateProfileObj.length) {
                let table = updateProfileObj[0].tables[action.tableID]

                // Iterate over table rows and update data
                if (table) {
                    table.forEach((row) => {
                        action.rows.forEach((data) => {
                            if (data.uuid === row.uuid) {
                                row = Object.assign(row, data)
                                row._meta = Object.assign(row._meta, data)
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
         * Updates/sets the active table ID.
         */
        case ActionTypes.SET_TABLEID_ACTIVE:
            return {
                ...state,
                tableIDActive: action.id
            }


        /**
         * Updates/sets the active table type.
         */
        case ActionTypes.SET_TABLETYPE_ACTIVE:
            return {
                ...state,
                tableTypeActive: action.tableType
            }


        /**
         * Set the most recently selected row object.
         */
        case ActionTypes.SET_SELECTED_ROW:
            return {
                ...state,
                currentSelectedRow: action.row,
                currentSelectedRowIndex: action.indexArr
            }


        /**
         * Returns default state upon no action call.
         */
        default:
            return state
    }
}

export default Reducers