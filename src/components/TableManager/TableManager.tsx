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
import CircularProgress from '@material-ui/core/CircularProgress'
import SymbolSearch from '../SymbolSearch/SymbolSearch'
import TableManagerSelectedRowsToolBar from './TableManagerSelectedRowsToolBar'
import TableManagerExpandableRow from './TableManagerExpandableRow'
import TableManagerStatusChip from './TableManagerStatusChip'
import TableManagerActionMenu from './TableManagerActionMenu'
import {prepareDataTableValues} from '../../libs/value_conversions'
import {getRowDataByUUID, makeRowObject, getRowTemplateObject} from '../../libs/state_modifiers'

const TableManager = (props) => {
    const {
        tableID,
        tableType,
        tableData,
        profileActive,
        currentSelectedRowIndex,
        addTableRows,
        updateTableRows,
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
                paddingRight: '16px',
            },

            // Selected delete menu style overrides
            '& .MuiPaper-root:first-child': {
                '& > .MuiPaper-root': {
                    minHeight: '68px !important',
                    backgroundColor: 'transparent',

                    // Fix for when using customToolbarSelect
                    '& > *:first-child': {
                        display: 'none'
                    },
                }
            },

            // Header overrides
            '& .MuiTable-root[role="grid"] .MuiTableHead-root': {
                '& .MuiButton-root': {
                    margin: '0',
                    padding: '4px 0 4px 0 !important',
                    borderTop: `2px solid ${theme.palette.secondary.main}`,
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                    borderRadius: '0',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                    }
                },
                '& .MuiTableCell-root': {
                    padding: '0 0 0 16px',
                    height: '48px'
                }
            },

            // Row style overrides
            '& .MuiTableBody-root .MuiTableCell-root[data-testid]:last-child': {
                textAlign: 'right'
            },

            // Cell style overrides
            '& .MuiTableCell-root:not(.MuiTableCell-head)': {
                '&:not(.datatables-noprint)': {
                    '& > *': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }
                },

                // UUID column
                '&[data-colindex="0"]:not(.datatables-noprint)': {
                    maxWidth: '50px !important',
                    '& > *': {
                        width: '100%'
                    }
                }
            },

            // Resizable columns divider
            '& [data-divider-index]': {
                '&:last-child': {
                    display: 'none'
                },
                '& > *': {
                    borderColor: 'transparent',
                    height: '48px',
                    '&:hover': {
                        borderColor: theme.palette.secondary.main
                    }
                }
            },

            // Footer overrides
            '& .MuiTable-root .MuiTableFooter-root .MuiTableRow-root': {
                '&:hover': {
                    backgroundColor: 'transparent !important'
                }
            }
        },
        table_loading: {
            color: theme.palette.text.primary,
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
                display: true
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
            name: "cost_basis",
            label: "cost_basis",
            options: {
                filter: true,
                sort: true,
                display: false
            }
        },
        {
            name: "purchase_price",
            label: "purchase_price",
            options: {
                filter: true,
                sort: true,
                display: false
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
            name: "limit_buy",
            label: "Limit Buy",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "limit_sell",
            label: "Limit Sell",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "loss_perc",
            label: "Max Loss %",
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
                sort: true,
                customBodyRender: (value, tableMeta, test) => {
                    let uuid = tableMeta.rowData[0]
                    let row = getRowDataByUUID(uuid, tableData)
                    if (!row) {
                        row = Object.assign(getRowTemplateObject(), makeRowObject(tableMeta.rowData))
                    }
                    return (
                        <TableManagerStatusChip row={row}/>
                    )
                }
            },
        },
        {
            name: "paused",
            label: "paused",
            options: {
                filter: true,
                sort: true,
                display: false
            }
        },
        {
            name: "tasks",
            label: "tasks",
            options: {
                filter: true,
                sort: true,
                display: false
            }
        },
        {
            name: "",
            label: "",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    let uuid = tableMeta.rowData[0]
                    let row = getRowDataByUUID(uuid, tableData)
                    if (!row) row = Object.assign(getRowTemplateObject(), makeRowObject(tableMeta.rowData))
                    return (
                        <TableManagerActionMenu row={row}/>
                    )
                }
            }
        },
    ])

    // Table data buffer used to proxy data table state
    const [proxyTableData, setProxyTableData] = useState([])

    // Flag to indicate whether table is loading
    const [tableLoading, setTableLoading] = useState(false)

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
                    setTableLoading(true)
                    const response = await fetch(`http://localhost:2222/app/get/orders/list/${profileKey}/${tableType}`)
                    let rows = await response.json()

                    // Add rows from database to table
                    if (rows.length) {

                        // Prepare values for data table
                        rows = prepareDataTableValues(rows)

                        // Load data into data table
                        addTableRows(profileKey, tableID, rows)
                    }
                    setTableLoading(false)
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

            // Calculate some values from data
            data_obj.rows = prepareDataTableValues(data_obj.rows)

            // Update the data table
            updateTableRows(data_obj._profile, data_obj._tableid, data_obj.rows)
        }
    }, [wsocket.current])

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
                        selectableRows: "single",
                        selectableRowsOnClick: true,
                        responsive: "standard",
                        rowsPerPage: 10,
                        // resizableColumns: true, @todo - Do we need this?
                        elevation: 0,
                        rowsSelected: currentSelectedRowIndex,
                        draggableColumns: {
                            enabled: false
                        },
                        fixedSelectColumn: true,
                        tableBodyHeight: 'calc(100vh - 237px)',
                        onRowSelectionChange: handleRowSelectionChange,
                        expandableRowsHeader: false,
                        expandableRows: true,
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                            let uuid = displayData[selectedRows.data[0].index].data[0]
                            let row = getRowDataByUUID(uuid, tableData)
                            return (
                                <TableManagerSelectedRowsToolBar
                                    uuid={uuid}
                                    row={row}
                                />
                            )
                        },
                        renderExpandableRow: (rowData, rowMeta) => {
                            let uuid = rowData[0]
                            let row = getRowDataByUUID(uuid, tableData)
                            return (
                                <TableManagerExpandableRow row={row} rowMeta={rowMeta}/>
                            )
                        },
                        textLabels: {
                            body: {
                                noMatch: tableLoading ?
                                    <CircularProgress size={24} className={classes.table_loading}/> :
                                    `Start by adding a symbol you would like to watch.`
                            }
                        }
                    }}
                />
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
        setSelectedRow: (row, indexArr) => dispatch(ActionTypes.setSelectedRow(row, indexArr)),
        setTableIDActive: (id) => dispatch(ActionTypes.setTableIDActive(id)),
        setTableTypeActive: (tableType) => dispatch(ActionTypes.setTableTypeActive(tableType))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
