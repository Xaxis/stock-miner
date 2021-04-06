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
import {getRowDataByUUID} from '../../libs/state_modifiers'

const TableManagerStatusColumn = (props) => {
    const {
        rowData,
        tableData,
        profileActive,
        tableIDActive,
        tableTypeActive,
        setSelectedRow,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            '& .chip-status-registered': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.primary.dark
                }
            },
            '& .chip-status-running': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.tertiary.dark
                }
            },
            '& .chip-status-paused': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.secondary.main
                }
            },
            '& .chip-status-finished': {
                '&.MuiChip-root': {
                    backgroundColor: theme.palette.quaternary.dark
                }
            }
        }
    }))()

    /**
     * Component states.
     */
    const [rowUUID, setRowUUID] = useState(rowData[0])
    const [status, setStatus] = useState('')

    /**
     * Load row data by UUID.
     */
    useEffect(() => {
        setRowUUID(rowData[0])
        let row = getRowDataByUUID(rowData[0], tableData)
        if (row) {
            setStatus(row.status)
        }
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
            <div className={classes.root}>
                <Chip
                    className={'chip-status-' + status.toLowerCase()}
                    size="small"
                    label={status}
                    icon={icon}
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
    rowData: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        profileActive: state.profileActive,
        tableIDActive: state.tableIDActive,
        tableTypeActive: state.tableTypeActive
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerStatusColumn)