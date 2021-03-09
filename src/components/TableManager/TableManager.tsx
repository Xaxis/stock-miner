import * as React from 'react'
import {useState, useEffect, useRef, useMemo, useCallback} from "react"
import PropTypes from "prop-types"
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
        tableData,
        newRegisteredTrades,
        registeredTradesToDelete,
        deleteTableRow,
        updateTableData,
        setSelectedTrade,
        ...other
    } = props;

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

    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false)
    const [rowsToDeleteNext, setRowsToDeleteNext] = useState([])

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
     */
    useEffect(() => {
        if (newRegisteredTrades.length) {
            newRegisteredTrades.forEach((trade) => {
                fetch(`http://localhost:2222/api/register/${trade.uuid}/${trade.type}/${trade.symbol}`)
            })
        }
    }, [newRegisteredTrades])

    /**
     * Delete a registered trade on the server.
     */
    useEffect(() => {
        if (registeredTradesToDelete.length) {
            registeredTradesToDelete.forEach((trade) => {
                fetch(`http://localhost:2222/api/deregister/${trade.uuid}`)
            })
        }
    }, [registeredTradesToDelete])

    /**
     * Handles table's row delete event.
     */
    const handleRowsDelete = (rowsDeleted) => {
        const uuidsToDelete = rowsDeleted.data.map(d => tableData[tableID][d.dataIndex].uuid)
        setRowsToDeleteNext(uuidsToDelete)
        // setDeleteAlertDialogOpen(true)
        deleteTableRow(tableID, uuidsToDelete)
        // return false
    }

    /**
     * Handles when row selection changes.
     */
    const handleRowSelectionChange = (currentRowArr, allRowsArr) => {
        if (allRowsArr.length) {
            let rowIndex = allRowsArr[allRowsArr.length-1].dataIndex
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
                    title={<SymbolSearch tableID={tableID}/>}
                    square
                    data={tableData[tableID]}
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
                    onClose={() => {
                        setRowsToDeleteNext([])
                        setDeleteAlertDialogOpen(false)
                    }}
                    onSubmit={() => {
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
    tableID: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        newRegisteredTrades: state.newRegisteredTrades,
        registeredTradesToDelete: state.registeredTradesToDelete
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteTableRow: (tableID, rows) => dispatch(ActionTypes.deleteTableRow(tableID, rows)),
        updateTableData: () => dispatch(ActionTypes.updateTableData()),
        setSelectedTrade: (row) => dispatch(ActionTypes.setSelectedTrade(row))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
