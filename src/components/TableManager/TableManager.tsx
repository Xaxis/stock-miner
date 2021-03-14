import * as React from 'react'
import {useState, useEffect, useRef, useMemo, useCallback} from "react"
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import {w3cwebsocket as W3CWebSocket} from 'websocket'
import Grid from '@material-ui/core/Grid'
import MUIDataTable from "mui-datatables"
import SymbolSearch from "../SymbolSearch/SymbolSearch"
import AlertDialog from '../AlertDialog/AlertDialog'
import './TableManager.scss'

// const socket = new W3CWebSocket('ws://localhost:2223')

const TableManager = (props) => {
    const {
        tableID,
        tableType,
        tableData,
        profileActive,
        addTableRows,
        deleteTableRow,
        updateTableData,
        setSelectedTrade,
        ...other
    } = props;

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
            name: "type",
            label: "Type",
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
            name: "shares",
            label: "Shares",
            options: {
                filter: true,
                sort: true
            }
        },

        {
            name: "equity",
            label: "Equity",
            options: {
                filter: true,
                sort: true
            }
        },

        {
            name: "change",
            label: "Change %",
            options: {
                filter: true,
                sort: true
            }
        },
    ])

    // Alert dialogue open state
    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false)

    // Buffer containing which rows to delete
    const [rowsToDeleteNext, setRowsToDeleteNext] = useState([])

    // Table data buffer used to proxy data table state
    const [proxyTableData, setProxyTableData] = useState([])

    /**
     * Loads in data associated with a profile from the server, occurs whenever a profile
     * is changed or when a table component is rerender (switching tabs).
     */
    useEffect(() => {
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
     * Receive updates from web socket server.
     */
    useEffect(() => {
        // socket.onmessage = (payload) => {
        //     let data = JSON.parse(payload.data)
        //
        //     // Iterate over each trade in table
        //     if (tableData[tableID]) {
        //         tableData[tableID].forEach((trade) => {
        //             try {
        //                 trade.price = data[trade.type.toUpperCase()][trade.symbol].bp
        //             } catch (error) {
        //                 console.log('Data Table will update on next iteration.')
        //             }
        //         })
        //         updateTableData()
        //     }
        // }
    })

    /**
     * Register new trade with server.
     * @todo - This should probably be removed entirely or placed in SymbolSearch
     */
    // useEffect(() => {
    //     if (newRegisteredTrades.length) {
    //         newRegisteredTrades.forEach((trade) => {
    //             fetch(`http://localhost:2222/api/register/${trade.uuid}/${trade.type}/${trade.symbol}`)
    //             fetch(`http://localhost:2222/app/register/orders/${profileActive[0]}/${tableType}/${trade.uuid}/${trade.type}/${trade.symbol}/Bitcoin`)
    //         })
    //     }
    // }, [newRegisteredTrades])

    /**
     * Delete a registered trade on the server.
     */
    // useEffect(() => {
    //     if (registeredTradesToDelete.length) {
    //         registeredTradesToDelete.forEach((trade) => {
    //             fetch(`http://localhost:2222/api/deregister/${trade.uuid}`)
    //         })
    //     }
    // }, [registeredTradesToDelete])

    /**
     * Handles table's row delete event.
     */
    const handleRowsDelete = (rowsDeleted) => {
        const profileKey = profileActive[0]
        const tableDataObj = tableData.filter((tableObj) => {
            return tableObj.tableProfile === profileKey
        })[0]
        const uuidsToDelete = rowsDeleted.data.map(d => tableDataObj.tables[tableID][d.dataIndex].uuid)
        setRowsToDeleteNext(uuidsToDelete)
        deleteTableRow(profileActive[0], tableID, uuidsToDelete)
        // setDeleteAlertDialogOpen(true)
        // return false
    }

    /**
     * Handles when row selection changes.
     */
    const handleRowSelectionChange = (currentRowArr, allRowsArr) => {
        if (allRowsArr.length) {
            let rowIndex = allRowsArr[allRowsArr.length - 1].dataIndex
            let selectedRow = tableData[tableID][rowIndex]
            setSelectedTrade(selectedRow)
        } else {
            setSelectedTrade(null)
        }
    }

    return (
        <Grid container spacing={0} id={`datatable-${tableID}-wrapper`}>
            <Grid item xs={12} className="tablemanager-datatable">
                <MUIDataTable
                    id={`datatable-${tableID}-wrapper`}
                    title={<SymbolSearch tableID={tableID} tableType={tableType}/>}
                    square
                    data={proxyTableData}
                    columns={columns}
                    options={{
                        filterType: "checkbox",
                        responsive: "standard",
                        selectableRows: "multiple",
                        selectableRowsOnClick: true,
                        responsive: "vertical",
                        rowsPerPage: 10,
                        elevation: 0,
                        draggableColumns: {
                            enabled: false
                        },
                        fixedSelectColumn: true,
                        tableBodyHeight: 'calc(100vh - 254px)',
                        onRowsDelete: handleRowsDelete,
                        onRowSelectionChange: handleRowSelectionChange
                        // expandableRowsHeader: true,
                        // expandableRows: true,
                        // renderExpandableRow: (rowData, rowMeta) => {
                        //     return (
                        //         <TableRow>
                        //             <TableCell>
                        //                 TEST
                        //             </TableCell>
                        //         </TableRow>
                        //     )
                        // }
                    }}
                />
                <AlertDialog
                    isOpen={deleteAlertDialogOpen}
                    onDisagree={() => {
                        setRowsToDeleteNext([])
                        setDeleteAlertDialogOpen(false)
                    }}
                    onAgree={() => {
                        deleteTableRow(tableID, rowsToDeleteNext)
                        setDeleteAlertDialogOpen(false)
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
        profileActive: state.profileActive
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.addTableRows(tableProfile, tableID, rows)),
        deleteTableRow: (tableProfile, tableID, rows) => dispatch(ActionTypes.deleteTableRow(tableProfile, tableID, rows)),
        updateTableData: () => dispatch(ActionTypes.updateTableData()),
        setSelectedTrade: (row) => dispatch(ActionTypes.setSelectedTrade(row))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
