import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ModifyIcon from '@material-ui/icons/Edit'
import PauseIcon from '@material-ui/icons/Pause'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenDialog from '../FullScreenDialog/FullScreenDialog'
import OrderDetailView from '../OrderDetailView/OrderDetailView'
import {getRowDataByUUID} from '../../libs/state_modifiers'

const TableManagerActionMenu = (props) => {
    const {
        rowData,
        tableData,
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
    const [anchorEl, setAnchorEl] = useState(null)
    const [fullscreenOpen, setFullscreenOpen] = useState(false)
    const [symbol, setSymbol] = useState('')
    const [stockName, setStockName] = useState('')
    const [stockPrice, setStockPrice] = useState('')

    /**
     * Load row data by UUID.
     */
    useEffect(() => {
        let row = getRowDataByUUID(rowData[0], tableData)
        if (row) {
            setSymbol(row.symbol)
            setStockName(row.name)
            setStockPrice('$' + row.price)
        }
    }, [tableData])

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
                <MenuItem>
                    <ListItemIcon>
                        <PauseIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Pause Order"/>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <DeleteForeverIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete Order"/>
                </MenuItem>
                <Divider/>
                <MenuItem
                    onClick={handleFullscreenOpen}
                >
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
                <OrderDetailView rowData={rowData}/>
            </FullscreenDialog>
        </>
    )
}

TableManagerActionMenu.propTypes = {
    rowData: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerActionMenu)