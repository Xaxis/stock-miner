import * as React from 'react'
import { useState, useEffect, useMemo, useCallback } from "react";
import './TableManager.scss'
import DataTable from 'react-data-table-component';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

export default function TableManager() {
  const columns = [
    {
      name: 'Symbol',
      selector: row => row.symbol,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
      right: false,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      right: false,
    },
    {
      name: 'Shares',
      selector: row => row.shares,
      sortable: true,
      right: false,
    },
    {
      name: 'Equity',
      selector: row => row.equity,
      sortable: true,
      right: false,
    },
    {
      name: 'Change',
      selector: row => row.change,
      sortable: true,
      right: false,
    },
  ];
  const data = [
    { id: 0, title: 'BTC', symbol: 'BTC', price: '62000', shares: '-', equity: '-', change: '-' },
    { id: 1, title: 'LTC', symbol: 'LTC', price: '250', shares: '-', equity: '-', change: '-' },
    { id: 2, title: 'ETH', symbol: 'ETH', price: '2200', shares: '-', equity: '-', change: '-' },
    { id: 3, title: 'ETC', symbol: 'ETC', price: '560', shares: '-', equity: '-', change: '-' },
  ];
  const row_template = { title: '-', symbol: '-', status: '-', price: '-', shares: '-', equity: '-', change: '-' }
  const [columnData, setColumnData] = useState(columns)
  const [tableData, setTableData] = useState([]);

  const handleRowSelection = (state) => {
    console.log('Selected Rows: ', state.selectedRows)
  }

  const handleColumnSort = (state, obj) => {
    // console.log(state.selector)
    // console.log('Column Sorted: ', state, obj)
  }

  const handleCustomColumnSort = (state, test, test2) => {
    // console.log('Column Sorted: ', state, test, test2)
    return [...tableData]
  }

  //@todo - Use this when working in development mode - remove later
  let test_data = {
    BTC: {symbol: 'BTC', bp: 49038, bs: 0.0164, ap: 48349.18, t:167342897343, r:234283974382, x:1},
    LTC: {symbol: 'LTC', bp: 250, bs: 0.0164, ap: 48349.18, t:167342897343, r:234283974382, x:1}
  }

  /*
   * Returns an array with references to all row objects that contain
   * the matching 'symbol' property.
   */
  const getRowsWithSymbol = (symbol, table) => {
    let ret = []
    for (let idx in table) {
      let row = table[idx]
      if (row.symbol == symbol) {
        ret.push(row)
      }
    }
    return ret
  }

  /*
   * @todo - ... Parses streamed stock data into our table component.
   */
  const parseStreamDataObject = (obj) => {
    for (const symbol in obj) {
      let row_data = obj[symbol]

      // Add new row to table if doesn't yet exist
      let matching_rows = getRowsWithSymbol(symbol, tableData)
      if (!matching_rows.length) {
        let new_row = Object.assign({}, row_template)
        new_row.title = symbol
        new_row.symbol = symbol
        new_row.price = row_data.bp
        tableData.push(new_row)
      }

      // Update the row in the table
      else {
        for (let row in matching_rows) {
          let row_obj = matching_rows[row]
          row_obj.price = row_data.bp
        }
      }

    }

    return tableData
  }

  useEffect(() => {

    // Process streamed market data when we receive it, populate the
    // table view, rerender React component.
    window.addEventListener('pywebviewready', function() {
      setInterval(function() {
        let promise = window.pywebview.api.get_stream_data()
        promise.then((result) => {
          let new_table_data = parseStreamDataObject(result)
          setTableData([...new_table_data])
        })
      }, 1000)
    })

    // setInterval(function() {
    //   let new_table_data = parseStreamDataObject(test_data)
    //   setTableData([...new_table_data])
    //   console.log(new_table_data)
    // }, 3000)

  }, [])



  return (
    <div className='tablemanager-container'>
        <DataTable
        columns={columnData}
        data={tableData}
        theme="dark"
        persistTableHead
        highlightOnHover
        selectableRows
        selectableRowsNoSelectAll
        selectableRowsHighlight
        selectableRowsComponent={Checkbox}
        sortIcon={<ArrowDownward />}
        onSelectedRowsChange={handleRowSelection}
        onSort={handleColumnSort}
        // sortFunction={handleCustomColumnSort}
        // defaultSortField="symbol"
      />
    </div>
  );
};
