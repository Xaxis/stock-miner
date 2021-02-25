import * as React from 'react'
import './Layout.scss'
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import Container from '@material-ui/core/Container'
import Search from '../Search/Search'
import TableManager from '../TableManager/TableManager'

export default function Layout() {
    const darkTheme = createMuiTheme({
        palette: {
            type: "dark"
        }
    })

    return (

        <MuiThemeProvider theme={darkTheme}>
            <Container className="layout-container">
                <div className="layout-container-header">
                    <Search/>
                </div>
                <div className="layout-container-body">
                    <TableManager/>
                </div>
                <div className="layout-container-footer">
                </div>
            </Container>
        </MuiThemeProvider>

    );
};
