import * as React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import LogoIcon from '@material-ui/icons/FingerPrint'
import ProfileSelect from '../ProfileSelect/ProfileSelect'
import './MainMenu.scss'

export default function MainMenu() {
    return (
        <AppBar position="static" className="mainmenu">
            <Toolbar className="mainmenu-wrapper">
                <Grid
                    container
                    spacing={0}
                    justify='flex-start'
                    alignItems='center'
                    className="mainmenu-grid"
                >
                    <Grid item xs={3} className="mainmenu-grid-col1">
                        <IconButton color="inherit">
                            <LogoIcon/>
                        </IconButton>
                    </Grid>
                    {/*<Grid item xs className="mainmenu-grid-col2">*/}
                    {/*    <Button aria-controls="file-menu" aria-haspopup="true">*/}
                    {/*        File*/}
                    {/*    </Button>*/}

                    {/*    <Button aria-controls="file-menu" aria-haspopup="true">*/}
                    {/*        Portfolio*/}
                    {/*    </Button>*/}

                    {/*    <Button aria-controls="file-menu" aria-haspopup="true">*/}
                    {/*        View*/}
                    {/*    </Button>*/}

                    {/*    <Button aria-controls="file-menu" aria-haspopup="true">*/}
                    {/*        Help*/}
                    {/*    </Button>*/}
                    {/*</Grid>*/}
                    <Grid item xs className="mainmenu-grid-col3">
                        <ProfileSelect />
                    </Grid>
                </Grid>

            </Toolbar>
        </AppBar>

    );
};
