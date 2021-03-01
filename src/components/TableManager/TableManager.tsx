import * as React from 'react'
import {useState, useEffect, useRef, useMemo, useCallback} from "react";
import Grid from '@material-ui/core/Grid'
import MUIDataTable from "mui-datatables"
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DataTable, {defaultThemes} from 'react-data-table-component';
import {orderBy} from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

export default function TableManager() {
    // const columns = [
    //     {
    //         name: 'Symbol',
    //         selector: row => row.symbol,
    //         sortable: true,
    //     },
    //     {
    //         name: 'Price',
    //         selector: row => row.price,
    //         sortable: true,
    //         right: false,
    //     },
    //     {
    //         name: 'Status',
    //         selector: row => row.status,
    //         sortable: true,
    //         right: false,
    //     },
    //     {
    //         name: 'Shares',
    //         selector: row => row.shares,
    //         sortable: true,
    //         right: false,
    //     },
    //     {
    //         name: 'Equity',
    //         selector: row => row.equity,
    //         sortable: true,
    //         right: false,
    //     },
    //     {
    //         name: 'Change %',
    //         selector: row => row.change,
    //         sortable: true,
    //         right: false,
    //     },
    // ];
    //@todo - Use this when working in development mode - remove later
    // let test_data = {
    //   BTC: {id: 0, symbol: 'BTC', bp: 49038, bs: 0.0164, ap: 48349.18, t:167342897343, r:234283974382, x:1},
    //   LTC: {id: 2, symbol: 'LTC', bp: 250, bs: 0.0164, ap: 48349.18, t:167342897343, r:234283974382, x:1},
    //   ETC: {id: 1, symbol: 'ETC', bp: 1980, bs: 0.0164, ap: 48349.18, t:167342897343, r:234283974382, x:1},
    // };
    let test_data = [
        {id: 0, symbol: 'BTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'LTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'ETC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'BTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'LTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'ETC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'BTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'LTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'ETC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'BTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'LTC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
        {id: 0, symbol: 'ETC', price: 90000, status: '-', shares: '-', equity: '-', change: '-'},
    ];

    const columns = [
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
    ]

    const row_template = {
        id: 0,
        title: '-',
        symbol: '-',
        status: '-',
        price: '-',
        shares: '-',
        equity: '-',
        change: '-'
    }
    const [devMode, setDevMode] = useState(false)
    const [tableData, setTableData] = useState([]);
    const [tableDataInterval, setTableDataInterval] = useState(0)

    /*
     * @todo - ...
     */
    const handleRowSelection = (state) => {
        console.log('Selected Rows: ', state.selectedRows)
    }

    /*
     * Custom onSort event for table.
     */
    const handleColumnSort = (column, sortDirection) => {
        let sorted = orderBy(tableData, column.selector, sortDirection)
        setTableData([...sorted])
    }

    /*
     * Returns an array with references to all row objects that contain
     * the matching 'symbol' property.
     */
    const getRowsWithSymbol = (symbol, table_data) => {
        let ret = []
        for (let idx in table_data) {
            let row = table_data[idx]
            if (row.symbol == symbol) {
                ret.push(row)
            }
        }
        return ret
    }

    /*
     * Receives data from API backend and creates new rows as well as updates the dataTable
     * objects representative of each row.
     */
    const parseStreamDataObject = (obj, table_data) => {
        let id = 0;
        for (const symbol in obj) {
            let row_data = obj[symbol]

            // Add new row to table if doesn't yet exist
            let matching_rows = getRowsWithSymbol(symbol, table_data)
            if (!matching_rows.length) {
                let new_row = Object.assign({}, row_template)
                new_row.id = id
                new_row.title = symbol
                new_row.symbol = symbol
                new_row.price = row_data.bp
                tableData.push(new_row)
            }

            // Update the row in the table
            else {
                for (let row in matching_rows) {
                    let row_obj = matching_rows[row]
                    // row_obj.price = row_data.bp
                    row_obj.price = row_obj.price + 1
                }
            }
            id += 1;
        }

        return tableData
    }

    /*
     * This method, useEffect is triggered every time the table is re-rendered. The interval loop
     * must be rebuilt every rerender so as to maintain access to the non-closure tableData. Without
     * this convenction of re-initializing the interval, sorting functionality on the table is
     * reset every time the table is updated with new data.
     */
    useEffect(() => {

        // Loop interval is recreated every time dataTable changes (such as on a sort event or
        // stream data update. This SHOULD be within a 'pywebviewready' event, however the interval
        // seems to allow the race condition to satisfy this functionality. If this chunk of code
        // is placed inside the event (a closure) sorting no longer functions properly because loopFunc
        // only has access to the initial state of tableData. Sigh. But this works.
        //  clearInterval(tableDataInterval)
        //  let loopFunc = () => {
        //    let promise = window.pywebview.api.get_stream_data()
        //    promise.then((result) => {
        //      let new_table_data = parseStreamDataObject(result, tableData)
        //      setTableData([...new_table_data])
        //    })
        //  }
        // setTableDataInterval(setInterval(loopFunc, 1000))

        //@todo - For frontend dev
        // clearInterval(tableDataInterval)
        // let loopFunc = () => {
        //     let new_table_data = parseStreamDataObject(test_data, tableData)
        //     setTableData([...new_table_data])
        // }
        // setTableDataInterval(setInterval(loopFunc, 1000))

    }, tableData)

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>

                <MUIDataTable
                    square
                    title="Profile Name"
                    data={test_data}
                    columns={columns}
                    options={{
                        filterType: "checkbox",
                        responsive: "standard",
                        selectableRows: "multiple",
                        selectableRowsOnClick: true,
                        responsive: "vertical",
                        rowsPerPage: 10,
                        draggableColumns: {
                            enabled: true
                        },
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



                {/*<DataTable*/}
                {/*  columns={columnData}*/}
                {/*  data={tableData}*/}
                {/*  theme="dark"*/}
                {/*  persistTableHead*/}
                {/*  highlightOnHover*/}
                {/*  selectableRows*/}
                {/*  selectableRowsNoSelectAll*/}
                {/*  selectableRowsHighlight*/}
                {/*  selectableRowsComponent={Checkbox}*/}
                {/*  sortIcon={<ArrowDownward />}*/}
                {/*  onSelectedRowsChange={handleRowSelection}*/}
                {/*  sortServer*/}
                {/*  onSort={handleColumnSort}*/}
                {/*  expandableRows*/}
                {/*/>*/}

            </Grid>
        </Grid>
    );
};
