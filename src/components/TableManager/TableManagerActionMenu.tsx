import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import Grid from '@material-ui/core/Grid'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PauseIcon from '@material-ui/icons/Pause'
import ArchiveIcon from '@material-ui/icons/Archive'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

const TableManagerActionMenu = (props) => {
    const {
        dataIndex,
        rowIndex,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            '& .MuiPaper-root': {
                border: `1px solid ${theme.palette.secondary.main} !important`
            }
        }
    }))()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleMenuClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setAnchorEl(null)
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
                className={classes.root}
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
                        <PauseIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Pause Order"/>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <ArchiveIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Archive Order"/>
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <ListItemIcon>
                        <DeleteForeverIcon size="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete Order"/>
                </MenuItem>
            </Menu>
        </>
    )
}

TableManagerActionMenu.propTypes = {
    dataIndex: PropTypes.any.isRequired,
    rowIndex: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerActionMenu)