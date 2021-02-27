import * as React from 'react'
import './Layout.scss'
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import MainMenu from '../MainMenu/MainMenu'
import TabManager from '../TabManager/TabManager'
import DataControls from '../DataControls/DataControls'
import TableManager from '../TableManager/TableManager'
import SideBarMenu from '../SideBarMenu/SideBarMenu'
import StatusBar from '../StatusBar/StatusBar'
import './Layout.scss'

export default function Layout() {
    const theme = createMuiTheme({
        palette: {
            type: "dark",
            // primary: {
            //     main: '#121212'
            // },
            // secondary: {
            //     main: '#152a38'
            // },
            // contrastThreshold: 0.5,
            // tonalOffset: 0.7
        },
        props: {
            MuiTextField: {
                margin: 'dense'
            },
            MuiInputBase: {
                margin: 'dense'
            },
            MuiButton: {
                size: 'small'
            }
        },
        overrides: {}
    })

    const classes = makeStyles((theme) => ({
        root: {},
        sideBarMenu: {
            border: '1px solid red',
            height: 'calc(100% - 42px)'
        },
    }))()

    return (
        <MuiThemeProvider theme={theme}>
            <MainMenu/>
            <Grid container spacing={0} className="layout-page-grid">
                <Grid item xs={3} className="layout-sidebarmenu">
                    <SideBarMenu/>
                </Grid>
                <Grid item xs={9} className="layout-mainpanel">
                    <TabManager/>
                </Grid>
            </Grid>
            <StatusBar/>
            {/*<Container className="layout-container" maxWidth={false}>*/}
            {/*    <Grid container spacing={4}>*/}
            {/*        <Grid item xs={12}>*/}
            {/*            <DataControls/>*/}
            {/*        </Grid>*/}
            {/*        <Grid item xs={12}>*/}
            {/*            <TableManager/>*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Container>*/}
        </MuiThemeProvider>

    );
};
