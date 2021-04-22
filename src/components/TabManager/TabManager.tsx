import * as React from 'react'
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import {makeStyles} from '@material-ui/core/styles'
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
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    }
}

const TabManager = ({setSelectedRow}) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: theme.palette.secondary.darkAlt,
            '& [role="tabpanel"]': {
                height: 'calc(100vh - 96px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                borderTop: `1px solid ${theme.palette.secondary.main}`
            },
        }
    }))()

    /**
     * Component states.
     */
    const [value, setValue] = useState(0)

    /**
     * Handle switching tabs.
     */
    const handleChange = (event, newValue) => {
        setSelectedRow(null)
        setValue(newValue)
    }

    return (
        <div className={classes.root}>
            <div position="static">
                <Box display='flex' flexGrow={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Simulate" {...a11yProps(0)} />
                        <Tab label="Order" {...a11yProps(1)} />
                    </Tabs>
                </Box>
            </div>
            <TabPanel value={value} index={0}>
                <TableManager tableID={0} tableType="simulated"/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TableManager tableID={1} tableType="actual"/>
            </TabPanel>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedRow: (row) => dispatch(ActionTypes.setSelectedRow(row))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabManager)
