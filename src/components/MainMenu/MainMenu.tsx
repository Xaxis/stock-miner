import * as React from 'react'
import {useTheme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import LogoIcon from '@material-ui/icons/Fingerprint'
import ProfileSelect from '../ProfileSelect/ProfileSelect'

export default function MainMenu() {
    const theme = useTheme()

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
