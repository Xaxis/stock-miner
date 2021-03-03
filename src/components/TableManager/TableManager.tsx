import * as React from 'react'
import {useState, useEffect, useRef, useMemo, useCallback} from "react";
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Grid from '@material-ui/core/Grid'
import MUIDataTable from "mui-datatables"
import SymbolSearch from "../SymbolSearch/SymbolSearch";
import './TableManager.scss'

const TableManager = ({tableData}) => {
    const [columns, setColumns] = useState([
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

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} className="tablemanager-datatable">
                <MUIDataTable
                    square
                    title={<SymbolSearch/>}
                    data={tableData}
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
                        tableBodyHeight: 'calc(100vh - 254px)'
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

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManager)
