import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Chip from '@material-ui/core/Chip'
import RegisteredIcon from '@material-ui/icons/Add'
import RunningIcon from '@material-ui/icons/DirectionsRun'
import PausedIcon from '@material-ui/icons/Pause'
import FinishedIcon from '@material-ui/icons/CheckCircle'
import DownArrowIcon from '@material-ui/icons/ArrowDropDownCircle'

const TableManagerStatusColumn = (props) => {
    const {
        row,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            '& .MuiChip-deleteIcon': {
                backgroundColor: 'transparent'
            },
            '& .chip-status-registered': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.status.registered.main
                }
            },
            '& .chip-status-running': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.status.running.main
                }
            },
            '& .chip-status-paused': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.status.paused.main
                }
            },
            '& .chip-status-finished': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.status.finished.main
                }
            }
        }
    }))()

    /**
     * Component states.
     */
    const [status, setStatus] = useState(row.status)

    /**
     * Load row data by UUID.
     */
    useEffect(() => {
        setStatus(row.status)
    }, [tableData])

    /**
     * Handle rendering the corresponding status chip.
     */
    const renderStatusChip = (status) => {
        let icon = null
        switch (status) {
            case 'Registered':
                icon = <RegisteredIcon/>
                break
            case 'Running':
                icon = <RunningIcon/>
                break
            case 'Paused':
                icon = <PausedIcon/>
                break
            case 'Finished':
                icon = <FinishedIcon/>
                break
            default:
                icon = <RegisteredIcon/>
        }
        return (
            // @todo - Build status chip down arrows into sub-task viewer somehow.
            <div className={classes.root}>
                <Chip
                    className={'chip-status-' + status.toLowerCase()}
                    size="small"
                    label={status}
                    icon={icon}
                    clickable
                    onDelete={() => {}}
                    deleteIcon={<DownArrowIcon/>}
                />
            </div>
        )
    }

    return (
        <>
            {renderStatusChip(status)}
        </>
    )
}

TableManagerStatusColumn.propTypes = {
    row: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerStatusColumn)