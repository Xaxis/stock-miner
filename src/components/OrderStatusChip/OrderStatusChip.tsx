import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Chip from '@material-ui/core/Chip'
import OrderStatusMenu from './OrderStatusMenu'
import RegisteredIcon from '@material-ui/icons/Done'
import RunningIcon from '@material-ui/icons/DirectionsRun'
import PausedIcon from '@material-ui/icons/Pause'
import FinishedIcon from '@material-ui/icons/CheckCircle'
import DownArrowIcon from '@material-ui/icons/ArrowDropDownCircle'

const OrderStatusChip = (props) => {
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
    const [tasks, setTasks] = useState(JSON.parse(row.tasks))
    const [anchorEl, setAnchorEl] = useState(null)

    /**
     * Re-set state when tableData changes.
     */
    useEffect(() => {
        setStatus(row.status)
        setTasks(JSON.parse(row.tasks))
    }, [tableData])

    /**
     * Handle menu open.
     */
    const handleMenuOpen = (e, target) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(target)
    }

    /**
     * Handle menu close.
     */
    const handleMenuClose = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(null)
    }

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
            <div className={classes.root}>
                <Chip
                    className={'chip-status-' + status.toLowerCase()}
                    size="small"
                    label={status}
                    icon={icon}
                    clickable={true}
                    onClick={(e) => {
                        handleMenuOpen(e, e.currentTarget)
                    }}
                    onDelete={(e) => {
                        handleMenuOpen(e, e.target.closest('.MuiChip-root'))
                    }}
                    deleteIcon={<DownArrowIcon/>}
                />

                <OrderStatusMenu
                    status={status}
                    tasks={tasks}
                    anchorEl={anchorEl}
                    onMenuClose={handleMenuClose}
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

OrderStatusChip.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusChip)