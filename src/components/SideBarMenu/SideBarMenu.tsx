import * as React from 'react'
import {useState} from "react"
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import PropTypes from "prop-types";
import './SideBarMenu.scss'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TuneIcon from '@material-ui/icons/Tune'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import ExtensionIcon from '@material-ui/icons/Extension'
import SettingsIcon from '@material-ui/icons/Settings'
import HistoryIcon from '@material-ui/icons/History'
import SideBarTradeMenu from '../SideBarTradeMenu/SideBarTradeMenu'
import SideBarControlsMenu from '../SideBarControlsMenu/SideBarControlsMenu'
import SideBarProfilesMenu from '../SideBarProfilesMenu/SideBarProfilesMenu'
import SideBarExtensionsMenu from '../SideBarExtensionsMenu/SideBarExtensionsMenu'
import SideBarSettingsMenu from '../SideBarSettingsMenu/SideBarSettingsMenu'
import SideBarHistoryMenu from '../SideBarHistoryMenu/SideBarHistoryMenu'

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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

    return (
        <div className="sidebarmenu">
            <div className="sidebarmenu-controls">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                >
                    <Tab label={<AttachMoneyIcon/>} aria-label="Trade"></Tab>
                    <Tab icon={<TuneIcon/>} aria-label="Controls"></Tab>
                    <Tab icon={<RecentActorsIcon/>} aria-label="Profiles"></Tab>
                    <Tab icon={<ExtensionIcon/>} aria-label="Extensions"></Tab>
                    <Tab icon={<SettingsIcon/>} aria-label="Settings"></Tab>
                    <Tab icon={<HistoryIcon/>} aria-label="History"></Tab>
                </Tabs>
            </div>
            <div className="sidebarmenu-panels">
                <TabPanel value={value} index={0}>
                    <SideBarTradeMenu/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SideBarControlsMenu/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <SideBarProfilesMenu/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <SideBarExtensionsMenu />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <SideBarSettingsMenu />
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <SideBarHistoryMenu />
                </TabPanel>
            </div>


        </div>
    );
};
