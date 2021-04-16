import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {isTaskDone} from '../../libs/state_modifiers'

const TableManagerColumnEquity = (props) => {
    const {
        row,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        enabled: {
            color: `${theme.palette.text.primary} !important`,
            fontWeight: 'bold'
        },
        disabled: {
            color: theme.palette.text.disabled
        }
    }))()

    /**
     * Component states.
     */
    const [tasks, setTasks] = useState(null)
    const [isEquitySet, setIsEquitySet] = useState(false)
    const [equity, setEquity] = useState('$0.00')

    /**
     * Only display equity when an order has actually been purchase/bought.
     */
    useEffect(() => {
        if (row.tasks) {
            setTasks(JSON.parse(row.tasks))
            if (isTaskDone(tasks, 'BUY') || isTaskDone(tasks, 'LIMIT_BUY')) {
                console.log(true)
                setEquity(row.equity)
                setIsEquitySet(true)
            }
        }
    }, [tableData])

    return (
        <div className={clsx(classes.disabled, {
            [classes.enabled]: isEquitySet
        })}>
            {equity}
        </div>
    )
}

TableManagerColumnEquity.propTypes = {
    row: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerColumnEquity)