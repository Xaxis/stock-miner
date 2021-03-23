import * as React from 'react'
import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
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
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function SideBarMenu() {
    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

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
        }
    }))()

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
                    <Tab label={<AttachMoneyIcon/>} aria-label="Order"></Tab>
                    <Tab icon={<TuneIcon/>} aria-label="Controls"></Tab>
                    <Tab icon={<RecentActorsIcon/>} aria-label="Profiles"></Tab>
                    <Tab icon={<ExtensionIcon/>} aria-label="Extensions"></Tab>
                    <Tab icon={<SettingsIcon/>} aria-label="Settings"></Tab>
                    <Tab icon={<HistoryIcon/>} aria-label="History"></Tab>
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
            </Grid>

        </Grid>
    );
};
