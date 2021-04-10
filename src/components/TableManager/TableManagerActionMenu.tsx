import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ModifyIcon from '@material-ui/icons/Edit'
import PauseIcon from '@material-ui/icons/Pause'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import AlertDialog from '../AlertDialog/AlertDialog'
import FullscreenDialog from '../FullScreenDialog/FullScreenDialog'
import OrderDetailView from '../OrderDetailView/OrderDetailView'

const TableManagerActionMenu = (props) => {
    const {
        row,
        tableData,
        profileActive,
        tableIDActive,
        tableTypeActive,
        deleteTableRows,
        setSelectedRow,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        menu: {
            '& .MuiPaper-root': {
                border: `1px solid ${theme.palette.secondary.main} !important`
            },
            '& .MuiList-root': {
                padding: '0 !important'
            },
            '& .MuiDivider-root': {
                margin: '0 !important'
            }
        },
    }))()

    /**
     * Component states.
     */
    const [rowUUID, setRowUUID] = useState(row.uuid)
    const [anchorEl, setAnchorEl] = useState(null)
    const [fullscreenOpen, setFullscreenOpen] = useState(false)
    const [symbol, setSymbol] = useState('')
    const [stockName, setStockName] = useState('')
    const [stockPrice, setStockPrice] = useState('')
    const [rowsToDeleteNext, setRowsToDeleteNext] = useState([])
    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false)
    const [orderPaused, setOrderPaused] = useState(false)

    /**
     * Load row data by UUID.
     */
    useEffect(() => {
        setRowUUID(row.uuid)
        setSymbol(row.symbol)
        setStockName(row.name)
        setStockPrice('$' + row.price)
        setOrderPaused(row.paused === "true")
    }, [tableData])

    /**
     * Sends request to server to delete rows.
     */
    useEffect(() => {
        let active = true

        // Delete rows when UUIDs are queued
        if (rowsToDeleteNext.length) {
            deleteTableRows(profileActive[0], tableIDActive, rowsToDeleteNext)
            rowsToDeleteNext.forEach((uuid) => {
                (async () => {
                    setRowsToDeleteNext([])
                    setSelectedRow(null, [])
                    const response = await fetch(`http://localhost:2222/app/deregister/orders/${tableTypeActive}/${uuid}`)
                    let result = await response.json()
                })()
            })
        }

        return () => {
            active = false
        }
    }, [rowsToDeleteNext])

    /**
     * Handle opening of menu.
     */
    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }

    /**
     * Handle closing of menu.
     */
    const handleMenuClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setAnchorEl(null)
    }

    /**
     * Handle opening the fullscreen dialog.
     */
    const handleFullscreenOpen = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setFullscreenOpen(true)
    }

    /**
     * Handle pausing/activating an individual order row.
     */
    const handlePauseOrder = () => {
        (async () => {
            let paused = orderPaused ? 'false' : 'true'
            const response = await fetch(`http://localhost:2222/app/set/orders/status/${rowUUID}/${paused}`)
            let result = await response.json()
        })()
    }

    return (
        <>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleMenuOpen(e)
                }}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                className={classes.menu}
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                open={Boolean(anchorEl)}
                elevation={0}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                onClose={handleMenuClose}
            >
                <MenuItem>
                    <ListItemIcon>
                        <ModifyIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Modify Order"/>
                </MenuItem>

                <Divider/>

                <MenuItem
                    onClick={(e) => {
                        handleMenuClose(e)
                        handlePauseOrder()
                    }}
                >
                    <ListItemIcon>
                        {orderPaused ? <PlayIcon size="small"/> : <PauseIcon size="small"/>}
                    </ListItemIcon>
                    <ListItemText primary={orderPaused ? "Activate Order" : "Pause Order"}/>
                </MenuItem>

                <MenuItem
                    onClick={(e) => {
                        setDeleteAlertDialogOpen(true)
                    }}
                >
                    <ListItemIcon>
                        <DeleteForeverIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete Order"/>
                </MenuItem>

                <Divider/>

                <MenuItem onClick={handleFullscreenOpen}>
                    <ListItemIcon>
                        <FullscreenIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Open Fullscreen"/>
                </MenuItem>
            </Menu>

            <FullscreenDialog
                isOpen={fullscreenOpen}
                onClose={() => {
                    setFullscreenOpen(false)
                }}
                title={`${symbol} (${stockName}) - ${stockPrice}`}>
                <OrderDetailView row={row}/>
            </FullscreenDialog>

            <AlertDialog
                isOpen={deleteAlertDialogOpen}
                onDisagree={() => {
                    setDeleteAlertDialogOpen(false)
                }}
                onAgree={() => {
                    setRowsToDeleteNext([rowUUID])
                }}
                title='Delete Order?'
                subtitle='Are you sure you want to attempt to delete the selected order?'
                agree={'Delete'}
                disagree={'Cancel'}
            >
            </AlertDialog>
        </>
    )
}

TableManagerActionMenu.propTypes = {
    row: PropTypes.any.isRequired,
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
    return {
        deleteTableRows: (tableProfile, tableID, uuids) => dispatch(ActionTypes.deleteTableRows(tableProfile, tableID, uuids)),
        setSelectedRow: (row, indexArr) => dispatch(ActionTypes.setSelectedRow(row, indexArr)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerActionMenu)