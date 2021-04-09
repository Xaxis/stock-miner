import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Chip from '@material-ui/core/Chip'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import RegisteredIcon from '@material-ui/icons/Done'
import RunningIcon from '@material-ui/icons/DirectionsRun'
import PausedIcon from '@material-ui/icons/Pause'
import FinishedIcon from '@material-ui/icons/CheckCircle'
import DownArrowIcon from '@material-ui/icons/ArrowDropDownCircle'
import PendingTaskIcon from '@material-ui/icons/Autorenew'
import CompleteTaskIcon from '@material-ui/icons/Check'

const StyledBadge = withStyles((theme) => ({
    badge: {
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge)

const TableManagerStatusChip = (props) => {
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
        },
        menu: {
            '& .MuiPopover-paper': {
                minWidth: '100px',
                maxWidth: '300px',
                borderRadius: '2px !important',
                '& .MuiListItem-root': {
                    paddingTop: '0',
                    paddingBottom: '0'
                },
                '& .MuiAvatar-circle': {
                    color: theme.palette.text.primary
                }
            },
            '&#chip-status-menu-registered': {
                '& .MuiPopover-paper': {
                    borderRadius: '2px !important',
                    border: `2px solid ${theme.palette.status.registered.main}`,
                    borderTop: `6px solid ${theme.palette.status.registered.main}`
                }
            },
            '&#chip-status-menu-running': {
                '& .MuiPopover-paper': {
                    border: `2px solid ${theme.palette.status.running.main}`,
                    borderTop: `6px solid ${theme.palette.status.running.main}`
                },
                '& .MuiAvatar-circle': {
                    backgroundColor: `${theme.palette.status.running.main}`
                },
                '& .MuiBadge-badge': {
                    color: `${theme.palette.status.running.alt}`,
                    backgroundColor: `${theme.palette.status.running.alt}`
                }
            },
        },
        list: {
        },
        list_item: {

        },
        list_item_complete: {
            opacity: '0.6',
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        avatar_complete: {
            '& .MuiAvatar-circle': {
                backgroundColor: `${theme.palette.secondary.main} !important`
            },
            '& .MuiBadge-badge': {
                display: 'none'
            }
        }
    }))()

    /**
     * Component states.
     */
    const [status, setStatus] = useState(row.status)
    const [tasks, setTasks] = useState(JSON.parse(row._meta.tasks))
    const [anchorEl, setAnchorEl] = useState(null)
    const [tasksText, setTasksText] = useState({
        BUY: {
            pending: {
                primary: 'Buy Order Pending',
                secondary: 'Will place buy order at {1}'
            },
            complete: {
                primary: 'Buy Order Completed',
                secondary: 'Order purchased at {1}'
            }
        },
        LIMIT_BUY: {
            pending: {
                primary: 'Buy Limit Order Pending',
                secondary: 'Will buy if price reaches {1}'
            },
            complete: {
                primary: 'Buy Limit Order Completed',
                secondary: 'Order purchased at {1}'
            }
        },
        SELL: {
            pending: {
                primary: 'Sell Order Pending',
                secondary: 'Will place sell order at {1}'
            },
            complete: {
                primary: 'Sell Order Completed',
                secondary: 'Order sold at {1}'
            }
        },
        LIMIT_SELL: {
            pending: {
                primary: 'Sell Limit Order Pending',
                secondary: 'Will sell if price reaches {1}'
            },
            complete: {
                primary: 'Sell Limit Order Completed',
                secondary: 'Order sold at {1}'
            }
        },
        LOSS_PREVENT: {
            pending: {
                primary: 'Loss Prevention Pending',
                secondary: 'Order will sell if price drops {1}%'
            },
            complete: {
                primary: 'Loss Preventing Completed',
                secondary: 'Order sold at {1}'
            }
        }
    })

    /**
     * Re-set state when tableData changes.
     */
    useEffect(() => {
        setStatus(row.status)
        setTasks(JSON.parse(row._meta.tasks))
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
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    /**
     * Render menu items.
     */
    const renderMenuItems = () => {
        return (
            <List className={classes.list}>
                {tasks.map((task, key) => {
                    return (
                        <ListItem key={key} className={clsx(classes.list_item, {
                            [classes.list_item_complete]: task.done
                        })}>
                            <ListItemAvatar className={clsx({
                                [classes.avatar_complete]: task.done
                            })}>
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    variant="dot"
                                >
                                    <Avatar className={classes.avatar}>
                                        {task.done ? <CompleteTaskIcon/> : <PendingTaskIcon/>}
                                    </Avatar>
                                </StyledBadge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={task.done ? tasksText[task.event].complete.primary : tasksText[task.event].pending.primary}
                                secondary={task.done ? tasksText[task.event].complete.secondary : tasksText[task.event].pending.secondary}
                            />
                        </ListItem>
                    )
                })}
            </List>
        )
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
            // @todo - Build status chip down arrows into sub-task viewer somehow.
            <div className={classes.root}>
                <Chip
                    className={'chip-status-' + status.toLowerCase()}
                    size="small"
                    label={status}
                    icon={icon}
                    clickable={status === 'Running' || status === 'Registered'}
                    onClick={(e) => {
                        handleMenuOpen(e, e.currentTarget)
                    }}
                    onDelete={(e) => {
                        handleMenuOpen(e, e.target.closest('.MuiChip-root'))
                    }}
                    deleteIcon={(status === 'Running' || status === 'Registered') ? <DownArrowIcon/> : <></>}
                />
                <Popover
                    id={'chip-status-menu-' + status.toLowerCase()}
                    className={classes.menu}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    {renderMenuItems()}
                </Popover>
            </div>
        )
    }

    return (
        <>
            {renderStatusChip(status)}
        </>
    )
}

TableManagerStatusChip.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerStatusChip)