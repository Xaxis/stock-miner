import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import OrderStatusChip from '../OrderStatusChip/OrderStatusChip'

const TableManagerColumnStatus = (props) => {
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
                borderTopWidth: '6px',
                borderRightWidth: '2px',
                borderBottomWidth: '2px',
                borderLeftWidth: '2px',
                borderStyle: 'solid',
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
                    borderColor: theme.palette.status.registered.main
                },
                '& .MuiAvatar-circle': {
                    backgroundColor: theme.palette.status.registered.main
                },
                '& .MuiBadge-badge': {
                    color: theme.palette.status.registered.alt,
                    backgroundColor: theme.palette.status.registered.alt
                }
            },
            '&#chip-status-menu-running': {
                '& .MuiPopover-paper': {
                    borderColor: theme.palette.status.running.main
                },
                '& .MuiAvatar-circle': {
                    backgroundColor: theme.palette.status.running.main
                },
                '& .MuiBadge-badge': {
                    color: theme.palette.status.running.alt,
                    backgroundColor: theme.palette.status.running.alt
                }
            },
            '&#chip-status-menu-finished': {
                '& .MuiPopover-paper': {
                    borderColor: theme.palette.status.finished.main
                },
                '& .MuiAvatar-circle': {
                    backgroundColor: theme.palette.status.finished.main
                },
                '& .MuiBadge-badge': {
                    color: theme.palette.status.finished.alt,
                    backgroundColor: theme.palette.status.finished.alt
                }
            },
            '&#chip-status-menu-paused': {
                '& .MuiPopover-paper': {
                    borderColor: theme.palette.status.paused.main
                },
                '& .MuiAvatar-circle': {
                    backgroundColor: theme.palette.status.paused.main
                },
                '& .MuiBadge-badge': {
                    display: 'none',
                    color: theme.palette.status.paused.alt,
                    backgroundColor: theme.palette.status.paused.alt
                },
                '& .MuiListItemText-root': {
                    opacity: '0.6'
                }
            },
        },
        list: {},
        list_item: {},
        list_item_complete: {
            opacity: '0.6'
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

    return (
        <>
            <OrderStatusChip row={row}/>
        </>
    )
}

TableManagerColumnStatus.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerColumnStatus)