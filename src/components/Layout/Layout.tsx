import * as React from 'react'
import './Layout.scss'
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import MainMenu from '../MainMenu/MainMenu'
import Search from '../Search/Search'
import DataControls from '../DataControls/DataControls'
import TableManager from '../TableManager/TableManager'

export default function Layout() {
    const darkTheme = createMuiTheme({
        palette: {
            type: "dark"
        },
        overrides: {
            MUIDataTableSelectCell: {
                root: {
                    display: 'none'
                }
            }
        }
    })

    return (
        <MuiThemeProvider theme={darkTheme}>
            <MainMenu />
            <Container className="layout-container">
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Search/>
                    </Grid>
                    <Grid item xs={12}>
                        <DataControls/>
                    </Grid>
                    <Grid item xs={12}>
                        <TableManager/>
                    </Grid>
                </Grid>
            </Container>
        </MuiThemeProvider>

    );
};
