import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import TableManagerOrderStepper from './TableManagerOrderStepper'

const TableManagerSelectedRowsToolBar = (props) => {
    const {
        selectedRows,
        displayData,
        setSelectedRows,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            border: '1px solid red !important',
            width: '100%',
            height: '100%'
        }
    }))()

    /**
     * Component states.
     */

    return (
        <div className={classes.root}>
            <TableManagerOrderStepper/>
        </div>
    )
}

TableManagerSelectedRowsToolBar.propTypes = {
    selectedRows: PropTypes.any.isRequired,
    displayData: PropTypes.any.isRequired,
    setSelectedRows: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerSelectedRowsToolBar)