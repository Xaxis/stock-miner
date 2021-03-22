import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import LogoIcon from '@material-ui/icons/Fingerprint'
import ProfileSelect from '../ProfileSelect/ProfileSelect'

export default function MainMenu() {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        mainmenu: {
            height: '48px',
            backgroundColor: theme.palette.secondary.dark,
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
            '& > .mainmenu-wrapper': {
                minHeight: '48px',
                maxHeight: '48px',
                paddingLeft: '12px',
                paddingRight: '12px',
            },
            '& .mainmenu-grid-col1': {
                minWidth: '68px',
                maxWidth: '68px'
            },
            '& .mainmenu-grid-col2': {
                'button + button': {
                    marginLeft: '8px'
                },
                'button:first-child': {
                    marginLeft: '4px'
                }
            },
            '& .mainmenu-grid-col3': {
                textAlign: 'right',
                minWidth: '136px',
                maxWidth: '136px'
            }
        }
    }))()

    return (
        <AppBar position="static" className={classes.mainmenu}>
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
                    <Grid item xs className="mainmenu-grid-col2">
                        {/*<Button aria-controls="file-menu" aria-haspopup="true">*/}
                        {/*    File*/}
                        {/*</Button>*/}

                        {/*<Button aria-controls="file-menu" aria-haspopup="true">*/}
                        {/*    Portfolio*/}
                        {/*</Button>*/}

                        {/*<Button aria-controls="file-menu" aria-haspopup="true">*/}
                        {/*    View*/}
                        {/*</Button>*/}

                        {/*<Button aria-controls="file-menu" aria-haspopup="true">*/}
                        {/*    Help*/}
                        {/*</Button>*/}
                    </Grid>
                    <Grid item xs className="mainmenu-grid-col3">
                        <ProfileSelect/>
                    </Grid>
                </Grid>

            </Toolbar>
        </AppBar>

    );
};
