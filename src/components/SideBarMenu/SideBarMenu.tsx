import * as React from 'react'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TuneIcon from '@material-ui/icons/Tune'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import ExtensionIcon from '@material-ui/icons/Extension'
import SettingsIcon from '@material-ui/icons/Settings'
import HistoryIcon from '@material-ui/icons/History'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import SideBarOrderMenu from '../SideBarOrderMenu/SideBarOrderMenu'
import SideBarControlsMenu from '../SideBarControlsMenu/SideBarControlsMenu'
import SideBarProfilesMenu from '../SideBarProfilesMenu/SideBarProfilesMenu'
import SideBarExtensionsMenu from '../SideBarExtensionsMenu/SideBarExtensionsMenu'
import SideBarSettingsMenu from '../SideBarSettingsMenu/SideBarSettingsMenu'
import SideBarHistoryMenu from '../SideBarHistoryMenu/SideBarHistoryMenu'

/**
 * Simple TabPanel component.
 */
function TabPanel(props) {
    const {children, value, index, ...other} = props
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}

const SideBarMenu = ({
                         ui,
                         setSideBarOpen,
                     }) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            height: 'calc(100vh - 68px)',
            backgroundColor: theme.palette.secondary.dark,
            borderRight: `1px solid ${theme.palette.secondary.main}`,
        },
        controls: {
            maxWidth: '68px',
            minWidth: '68px',
            height: '100%',
            backgroundColor: theme.palette.secondary.dark,
            borderRight: `1px solid ${theme.palette.secondary.main}`,
        },
        panels: {
            height: '100%',
            width: '331px',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: theme.palette.secondary.dark
        },
        tabs: {
            backgroundColor: `${theme.palette.secondary.dark} !important`
        },
        tabs_inactive: {
            '& .MuiTabs-indicator': {
                backgroundColor: 'transparent !important'
            },
            '& .MuiTab-root.Mui-selected': {
                backgroundColor: 'transparent',
                color: `${theme.palette.text.secondary} !important`
            }
        },
        popover: {
            pointerEvents: 'none',
            marginLeft: '8px',
            '& .MuiPaper-root': {
                backgroundColor: `${theme.palette.secondary.main} !important`,
                color: theme.palette.text.secondary,
                padding: '4px',
                borderRadius: '2px !important',
            }
        },
        menu_toggle: {
            position: 'absolute',
            left: '13px',
            bottom: '6px',
            color: theme.palette.text.disabled,
            opacity: '0.25',
            '&:hover': {
                color: theme.palette.text.secondary,
                opacity: '1',
                backgroundColor: 'transparent !important'
            }
        },
        menu_toggle_open: {
            transform: 'rotate(0)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menu_toggle_close: {
            transform: 'rotate(-180deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.enteringScreen
            })
        }
    }))()

    /**
     * Component states.
     */
    const [value, setValue] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const [popoverString, setPopoverString] = useState('')
    const [sideBarMenuOpen, setSideBarMenuOpen] = useState(false)

    /**
     * Handle switching tabs.
     */
    const handleChange = (e, newValue) => {
        setValue(newValue)
        handlePopoverClose()
        setSideBarMenuOpen(true)
        setSideBarOpen(true)
    }

    /**
     * Handle show/hide of popover.
     */
    const handlePopoverOpen = (e, string) => {
        setPopoverString(string)
        setAnchorEl(e.currentTarget)
    }
    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

    /**
     * Handle toggling sidebar menu open/closed.
     */
    const handleToggleMenu = (e) => {
        if (ui.sideBarOpen) {
            setSideBarMenuOpen(false)
            setSideBarOpen(false)
        } else {
            setSideBarMenuOpen(true)
            setSideBarOpen(true)
        }
    }

    return (
        <div
            className={classes.root}
        >
            <div className={classes.controls}>
                <Tabs
                    className={clsx(classes.tabs, {
                        [classes.tabs_inactive]: !sideBarMenuOpen,
                    })}
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                >
                    <Tab
                        icon={<AttachMoneyIcon/>}
                        aria-label="Order"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "Buy/Sell")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                    <Tab
                        icon={<TuneIcon/>}
                        aria-label="Controls"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "Controls")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                    <Tab
                        icon={<RecentActorsIcon/>}
                        aria-label="Profiles"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "Profiles")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                    <Tab
                        icon={<ExtensionIcon/>}
                        aria-label="Extensions"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "Extensions")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                    <Tab
                        icon={<SettingsIcon/>}
                        aria-label="Settings"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "Settings")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                    <Tab
                        icon={<HistoryIcon/>}
                        aria-label="History"
                        onMouseEnter={(e) => {
                            handlePopoverOpen(e, "History")
                        }}
                        onMouseLeave={handlePopoverClose}
                    ></Tab>
                </Tabs>
                <IconButton
                    className={clsx(classes.menu_toggle, {
                        [classes.menu_toggle_open]: sideBarMenuOpen,
                        [classes.menu_toggle_close]: !sideBarMenuOpen
                    })}
                    onClick={handleToggleMenu}
                >
                    <MenuOpenIcon/>
                </IconButton>
            </div>
            <div className={classes.panels}>
                <TabPanel value={value} index={0}>
                    <SideBarOrderMenu/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SideBarControlsMenu/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <SideBarProfilesMenu/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <SideBarExtensionsMenu/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <SideBarSettingsMenu/>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <SideBarHistoryMenu/>
                </TabPanel>

                <Popover
                    className={classes.popover}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left'
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography>{popoverString}</Typography>
                </Popover>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        ui: state.ui
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSideBarOpen: (open) => dispatch(ActionTypes.setSideBarOpen(open)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarMenu)
