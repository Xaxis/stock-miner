import * as React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import TableManager from '../TableManager/TableManager'

function TabPanel(props) {
    const {children, value, index, ...other} = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabmanager-mainpanel-${index}`}
            aria-labelledby={`tabmanager-mainpanel-${index}`}
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

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#151515',
        overflow: 'hidden',
        '& [role="tabpanel"]': {
            height: 'calc(100vh - 117px)',
            overflowY: 'auto',
            overflowX: 'hidden'
        }
    },
}));

export default function TabManager() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Box display='flex' flexGrow={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab label="Simulating" {...a11yProps(0)} />
                        <Tab label="Holding" {...a11yProps(1)} />
                    </Tabs>
                </Box>
            </AppBar>
            <TabPanel value={value} index={0}>
                <TableManager tableID={0}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TableManager tableID={1}/>
            </TabPanel>
        </div>
    );
}
