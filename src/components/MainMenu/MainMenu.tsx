import * as React from 'react'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import LogoIcon from '@material-ui/icons/FingerPrint'
import Search from "../Search/Search";
import './MainMenu.scss'

export default function MainMenu() {
    return (
        <AppBar position="sticky" className="mainmenu">
            <Toolbar>
                <Box display='flex' flexGrow={1}>
                    <IconButton edge="start" color="inherit">
                        <LogoIcon/>
                    </IconButton>

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
                </Box>
                <Search/>
            </Toolbar>
        </AppBar>

    );
};
