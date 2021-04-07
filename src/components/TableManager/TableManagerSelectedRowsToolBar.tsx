import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import TableManagerOrderStepper from './TableManagerOrderStepper'

const TableManagerSelectedRowsToolBar = (props) => {
    const {
        uuid,
        row,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            width: '100%',
            height: '100%'
        }
    }))()

    return (
        <div className={classes.root}>
            <TableManagerOrderStepper row={row}/>
        </div>
    )
}

TableManagerSelectedRowsToolBar.propTypes = {
    row: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerSelectedRowsToolBar)