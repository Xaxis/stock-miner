import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import {w3cwebsocket as W3CWebSocket} from 'websocket'
import Grid from '@material-ui/core/Grid'
import MUIDataTable from "mui-datatables"
import SymbolSearch from '../SymbolSearch/SymbolSearch'
import AlertDialog from '../AlertDialog/AlertDialog'
import TableManagerExpandableRow from './TableManagerExpandableRow'
import TableManagerActionMenu from './TableManagerActionMenu'

const TableManager = (props) => {
    const {
        tableID,
        tableType,
        tableData,
        profileActive,
        currentSelectedRowIndex,
        addTableRows,
        updateTableRows,
        deleteTableRows,
        setSelectedRow,
        setTableIDActive,
        setTableTypeActive,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        tablemanager: {

            // DataTable main toolbar
            '& .MuiToolbar-root[role="toolbar"]': {
                minHeight: '68px',
                paddingLeft: '16px',
                paddingRight: '16px'
            },

            // Selected delete menu style overrides
            '& .MuiPaper-root:first-child': {
                '& > .MuiPaper-root': {
                    minHeight: '68px !important',
                    backgroundColor: theme.palette.secondary.dark
                }
            },

            // Row style overrides
            '& .MuiTableBody-root .MuiTableCell-root[data-testid]:last-child': {
                textAlign: 'right'
            }
        }
    }))()

    // Data table column configuration
    const [columns, setColumns] = useState([
        {
            name: "uuid",
            label: "UUID",
            options: {
                filter: true,
                sort: true,
                display: false
            }
        },
        {
            name: "market",
            label: "Market",
            options: {
                filter: true,
                sort: true,
                display: false
            }
        },
        {
            name: "symbol",
            label: "Symbol",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "status",
            label: "Status",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "limit_buy",
            label: "Buy Point",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "limit_sell",
            label: "Sell Point",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "",
            label: "",
            options: {
                filter: false,
                sort: false,
                display: true,
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <TableManagerActionMenu dataIndex={rowIndex} rowIndex={rowIndex}/>
                    )
                }
            }
        },
    ])

    // Alert dialogue open state
    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false)

    // Buffer containing which rows to delete
    const [rowsToDeleteNext, setRowsToDeleteNext] = useState([])

    // Table data buffer used to proxy data table state
    const [proxyTableData, setProxyTableData] = useState([])

    // Web socket used to access data stream
    const wsocket = useRef(null)

    /**
     * Loads in data associated with a profile from the server, occurs whenever a profile
     * is changed or when a table component is rerender (switching tabs).
     */
    useEffect(() => {

        // Set the active table ID and table type
        setTableIDActive(tableID)
        setTableTypeActive(tableType)

        // Load rows from database
        if (profileActive.length) {
            let profileKey = profileActive[0]
            if (profileKey !== 'noop') {
                (async () => {
                    const response = await fetch(`http://localhost:2222/app/get/orders/list/${profileKey}/${tableType}`)
                    let rows = await response.json()

                    // Add rows from database to table
                    if (rows.length) {
                        addTableRows(profileKey, tableID, rows)
                    }
                })()
            }
        }

    }, [profileActive])

    /**
     * Provides state proxy to table data from the state manager, updating data in tables when
     * it changes while verifying that a profile has been loaded.
     */
    useEffect(() => {
        if (profileActive.length) {
            let profileKey = profileActive[0]
            if (profileKey !== 'noop') {

                // See if corresponding table object exists
                let tableDataObj = tableData.filter((tableObj) => {
                    return tableObj.tableProfile === profileKey
                })

                // Update the proxy table data a matching profile object exists
                if (tableDataObj.length) {
                    setProxyTableData(tableDataObj[0].tables[tableID])
                }

                // Otherwise, check if data is available in the database that hasn't yet been loaded
                else {
                    setProxyTableData([])
                }
            }
        }
    }, [tableData, profileActive])


    /**
     * Initialize the websocket and request socket data for profile.
     */
    useEffect(() => {
        if (profileActive.length && profileActive.indexOf('noop') == -1) {
            wsocket.current = new W3CWebSocket('ws://localhost:2223')
            wsocket.current.onopen = () => {
                console.log('SM: WebSocket: Client socked OPENED.')
                wsocket.current.send(JSON.stringify({
                    action: 'get-data-for-profile',
                    data: {tableid: tableID, profile: profileActive[0]}
                }))
            }
            wsocket.current.onclose = () => {
                console.log('SM: WebSocket: Client socked CLOSED.')
            }
            return () => {
                wsocket.current.close()
            }
        }
    }, [profileActive])

    /**
     * Handle messages from websocket server.
     */
    useEffect(() => {
        if (!wsocket.current) return
        wsocket.current.onmessage = (payload) => {
            let data_obj = JSON.parse(payload.data)
            updateTableRows(data_obj._profile, data_obj._tableid, data_obj.rows)
        }
    }, [wsocket.current])

    /**
     * Sends request to server to delete rows.
     * @todo - Implement alert dialog before deleting rows.
     */
    useEffect(() => {
        if (rowsToDeleteNext.length) {
            deleteTableRows(profileActive[0], tableID, rowsToDeleteNext)
            rowsToDeleteNext.forEach((uuid) => {
                (async () => {
                    const response = await fetch(`http://localhost:2222/app/deregister/orders/${tableType}/${uuid}`)
                    let result = await response.json()
                    setRowsToDeleteNext([])
                    setSelectedRow(null, [])
                })()
            })
        }
    }, [rowsToDeleteNext])

    /**
     * Handles table's row delete event. Adding UUIDs to the rowsToDeleteNext array
     * triggers the corresponding useEffect action and sends the UUIDs to delete to the
     * server.
     * @todo - Implement alert dialog before deleting rows.
     */
    const handleRowsDelete = (rowsDeleted) => {
        const profileKey = profileActive[0]
        const tableDataObj = tableData.filter((tableObj) => {
            return tableObj.tableProfile === profileKey
        })[0]
        const uuidsToDelete = rowsDeleted.data.map(d => tableDataObj.tables[tableID][d.dataIndex].uuid)
        setRowsToDeleteNext(uuidsToDelete)
        // setDeleteAlertDialogOpen(true)
        // return false
    }

    /**
     * Sets the selected row object in the store/state. This is used by all other
     * parts of the app that need a rows data.
     */
    const handleRowSelectionChange = (currentRowArr, allRowsArr) => {
        const profileKey = profileActive[0]
        const tableDataObj = tableData.filter((tableObj) => {
            return tableObj.tableProfile === profileKey
        })[0]
        if (allRowsArr.length) {
            let rowIndex = allRowsArr[allRowsArr.length - 1].dataIndex
            let selectedRow = tableDataObj.tables[tableID][rowIndex]
            setSelectedRow(selectedRow, [currentRowArr[0].index])
        } else {
            setSelectedRow(null, [])
        }
    }

    return (
        <Grid container spacing={0} id={`datatable-${tableID}-wrapper`}>
            <Grid item xs={12} className={classes.tablemanager}>
                <MUIDataTable
                    id={`datatable-${tableID}-wrapper`}
                    title={<SymbolSearch tableID={tableID} tableType={tableType}/>}
                    square
                    data={proxyTableData}
                    columns={columns}
                    options={{
                        filterType: "checkbox",
                        responsive: "standard",
                        selectableRows: "single",
                        selectableRowsOnClick: true,
                        responsive: "vertical",
                        rowsPerPage: 10,
                        elevation: 0,
                        rowsSelected: currentSelectedRowIndex,
                        draggableColumns: {
                            enabled: false
                        },
                        fixedSelectColumn: true,
                        tableBodyHeight: 'calc(100vh - 237px)',
                        // serverSide: true,
                        // onTableChange: (action, tableState) => {
                        //     console.log(action, tableState)
                        // },
                        onRowsDelete: handleRowsDelete,
                        onRowSelectionChange: handleRowSelectionChange,
                        expandableRowsHeader: false,
                        expandableRows: true,
                        renderExpandableRow: (rowData, rowMeta) => {
                            return (
                                <TableManagerExpandableRow rowData={rowData} rowMeta={rowMeta}/>
                            )
                        }
                    }}
                />
                <AlertDialog
                    isOpen={deleteAlertDialogOpen}
                    onDisagree={() => {
                        // setRowsToDeleteNext([])
                        // setDeleteAlertDialogOpen(false)
                    }}
                    onAgree={() => {
                        // deleteTableRows(tableID, rowsToDeleteNext)
                        // setDeleteAlertDialogOpen(false)
                    }}
                    title='Delete trades in table?'
                    subtitle='Are you sure you want to attempt to delete the selected trades?
                    Note: Any held trades will not be deleted. You must sell them first.'
                    agree={'Delete'}
                    disagree={'Cancel'}
                >
                </AlertDialog>
            </Grid>
        </Grid>
    )
}

TableManager.propTypes = {
    tableID: PropTypes.any.isRequired,
    tableType: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        profileActive: state.profileActive,
        currentSelectedRowIndex: state.currentSelectedRowIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.addTableRows(tableProfile, tableID, rows)),
        updateTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.updateTableRows(tableProfile, tableID, rows)),
        deleteTableRows: (tableProfile, tableID, uuids) => dispatch(ActionTypes.deleteTableRows(tableProfile, tableID, uuids)),
        setSelectedRow: (row, indexArr) => dispatch(ActionTypes.setSelectedRow(row, indexArr)),
        setTableIDActive: (id) => dispatch(ActionTypes.setTableIDActive(id)),
        setTableTypeActive: (tableType) => dispatch(ActionTypes.setTableTypeActive(tableType))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
