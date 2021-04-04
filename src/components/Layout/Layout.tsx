import * as React from 'react'
import clsx from 'clsx'
import {useState, useEffect} from 'react'
import fetch from 'cross-fetch'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import MainMenu from '../MainMenu/MainMenu'
import TabManager from '../TabManager/TabManager'
import SideBarMenu from '../SideBarMenu/SideBarMenu'
import StatusBar from '../StatusBar/StatusBar'

const Layout = ({
                    ui,
                    setProfileActive,
                    setProfileList
                }) => {

    /**
     * Component states.
     */
    const [drawerWidth, setDrawerWidth] = useState(68)
    const [drawerOpen, setDrawerOpen] = useState(false)

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        wrapper: {
            height: 'calc(100% - 66px)',
            display: 'flex'
        },
        drawer: {
            zIndex: '500',
            flexShrink: 0,
            width: drawerWidth,
            overflowX: 'hidden',
            '& > .MuiPaper-root': {
                top: '48px',
                height: 'calc(100vh - 68px)',
            }
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        main: {
            zIndex: '510',
            flexGrow: 1
        }
    }))()

    /**
     * Load initial profile values from the server.
     */
    useEffect(() => {
        (async () => {

            // Load active profile and set its state
            const ap_response = await fetch(`http://localhost:2222/app/get/profiles/active`)
            const ap_result = await ap_response.json()
            setProfileActive(ap_result)

            // Load profile list and set its state
            const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
            const pl_result = await pl_response.json()
            setProfileList(pl_result)
        })()
    })

    /**
     * Handle changing the sidebar open state.
     */
    useEffect(() => {
        if (ui.sideBarOpen) {
            handleDrawerOpen()
        } else if (!ui.sideBarOpen) {
            handleDrawerClose()
        }
    }, [ui])

    /**
     * Handle open/close of drawer.
     */
    const handleDrawerOpen = () => {
        setDrawerWidth(400)
        setDrawerOpen(true)
    }
    const handleDrawerClose = () => {
        setDrawerWidth(68)
        setDrawerOpen(false)
    }

    return (
        <>
            <CssBaseline/>
            <MainMenu/>
            <div className={classes.wrapper}>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen
                    })}
                >
                    <SideBarMenu/>
                </Drawer>
                <div className={classes.main}>
                    <TabManager/>
                </div>
            </div>
            <StatusBar/>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        ui: state.ui
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProfileActive: (active) => dispatch(ActionTypes.setProfileActive(active)),
        setProfileList: (list) => dispatch(ActionTypes.setProfileList(list)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
