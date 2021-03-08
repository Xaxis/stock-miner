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
import './TableManager.scss'

const socket = new W3CWebSocket('ws://localhost:2223')

const TableManager = (props) => {
    const {
        tableID,
        tableData,
        newRegisteredTrades,
        registeredTradesToDelete,
        deleteTableRow,
        updateTableData,
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
                display: true
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
    const [socketEstablished, setSocketEstablished] = useState(false)

    /**
     * Receive updates from web socket server.
     */
    useEffect(() => {
        if (!socketEstablished) {
            socket.onmessage = (payload) => {
                let data = JSON.parse(payload.data)

                // Iterate over each trade in table
                if (tableData[tableID]) {

                    // let updatedTableRows = []
                    tableData[tableID].forEach((trade) => {
                        trade.price = data[trade.type.toUpperCase()][trade.symbol].bp
                        // updatedTableRows.push(trade)
                    })

                    // tableData[tableID] = updatedTableRows
                    // tableData = [...tableData]
                    updateTableData(tableID, tableData[tableID])
                }

            }
            setSocketEstablished(true)
        }
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
        deleteTableRow(tableID, uuidsToDelete)
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
                            enabled: true
                        },
                        fixedSelectColumn: true,
                        tableBodyHeight: 'calc(100vh - 254px)',
                        onRowsDelete: handleRowsDelete
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
        updateTableData: (tableID, updatedTableData) => dispatch(ActionTypes.updateTableData(tableID, updatedTableData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
