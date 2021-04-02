import * as React from 'react'
import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TuneIcon from '@material-ui/icons/Tune'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import ExtensionIcon from '@material-ui/icons/Extension'
import SettingsIcon from '@material-ui/icons/Settings'
import HistoryIcon from '@material-ui/icons/History'
import SideBarOrderMenu from '../SideBarOrderMenu/SideBarOrderMenu'
import SideBarControlsMenu from '../SideBarControlsMenu/SideBarControlsMenu'
import SideBarProfilesMenu from '../SideBarProfilesMenu/SideBarProfilesMenu'
import SideBarExtensionsMenu from '../SideBarExtensionsMenu/SideBarExtensionsMenu'
import SideBarSettingsMenu from '../SideBarSettingsMenu/SideBarSettingsMenu'
import SideBarHistoryMenu from '../SideBarHistoryMenu/SideBarHistoryMenu'
import {makeStyles} from '@material-ui/core/styles'

/**
 * Simple TabPabel component.
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


export default function SideBarMenu() {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            height: 'calc(100vh - 68px)',
            backgroundColor: theme.palette.secondary.dark,
            borderRight: `1px solid ${theme.palette.secondary.main}`
        },
        controls: {
            maxWidth: '68px',
            minWidth: '68px',
            height: '100%',
            backgroundColor: theme.palette.secondary.dark,
            borderRight: `1px solid ${theme.palette.secondary.main}`
        },
        panels: {
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: theme.palette.secondary.dark
        },
        tabs: {
            backgroundColor: `${theme.palette.secondary.dark} !important`
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
        }
    }))()

    /**
     * Component states.
     */
    const [value, setValue] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const [popoverString, setPopoverString] = useState('')

    /**
     * Handle switching tabs.
     */
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    /**
     * Handle show/hide of popover.
     */
    const handlePopoverOpen = (e, string) => {
        setPopoverString(string)
        setAnchorEl(e.currentTarget)
    }
    const handlePopoverClose = (e) => {
        setAnchorEl(null)
    }

    return (
        <Grid
            container
            spacing={0}
            justify='flex-start'
            className={classes.root}
        >
            <Grid item xs={3} className={classes.controls}>
                <Tabs
                    className={classes.tabs}
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                >
                    <Tab
                        label={<AttachMoneyIcon/>}
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
            </Grid>
            <Grid item xs className={classes.panels}>
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
            </Grid>

        </Grid>
    );
};
