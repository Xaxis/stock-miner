import * as React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Grid from '@material-ui/core/Grid'
import MainMenu from '../MainMenu/MainMenu'
import TabManager from '../TabManager/TabManager'
import SideBarMenu from '../SideBarMenu/SideBarMenu'
import StatusBar from '../StatusBar/StatusBar'
import {useEffect} from 'react'
import fetch from 'cross-fetch'

const Layout = ({
                    setProfileActive,
                    setProfileList
                }) => {

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

    return (
        <>
            <CssBaseline/>
            <MainMenu/>
            <Grid container spacing={0} className="layout-page-grid">
                <Grid item xs={3}>
                    <SideBarMenu/>
                </Grid>
                <Grid item xs={9}>
                    <TabManager/>
                </Grid>
            </Grid>
            <StatusBar/>
        </>
    )
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProfileActive: (active) => dispatch(ActionTypes.setProfileActive(active)),
        setProfileList: (list) => dispatch(ActionTypes.setProfileList(list)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
