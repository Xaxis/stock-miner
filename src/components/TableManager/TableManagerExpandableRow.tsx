import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const TableManagerExpandableRow = (props) => {
    const {
        rowData,
        rowMeta,
        tableData,
        ...other
    } = props

    /**
     * ... @todo - under construction
     */
    useEffect(() => {
        // console.log(rowData, rowMeta)
        console.log(getRowDataByUUID(rowData[0]))
    }, [tableData])

    /**
     * Returns a reference to a row in tableData by UUID.
     */
    const getRowDataByUUID = (uuid) => {
        let result = null
        if (tableData.length) {

            // Iterate over profiles
            tableData.forEach((profile) => {

                // Iterate over tables in profile
                profile.tables.forEach((table) => {

                    // Search for matching row
                    let row = table.filter((row) => {
                        return row.uuid === uuid
                    })

                    // Return if found
                    if (row.length) {
                        result = row[0]
                    }
                })
            })
            return result
        } else {
            return null
        }
    }

    return (
        <TableRow>
            <TableCell colSpan={42}>
                <Collapse in={true}>
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <Typography>
                                TEST 1
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                TEST 2
                            </Typography>
                        </Grid>
                    </Grid>
                </Collapse>
            </TableCell>
        </TableRow>
    )
}

TableManagerExpandableRow.propTypes = {
    rowData: PropTypes.any.isRequired,
    rowMeta: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerExpandableRow)