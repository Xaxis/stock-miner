import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import {makeStyles} from '@material-ui/core/styles'

export default function MainMenu() {
    const classes = makeStyles((theme) => ({
        root: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        title: {
            flexGrow: 1
        }
    }))

    return (
        <AppBar position="fixed" className={classes.root}>
            <Toolbar>
                <IconButton edge="start" color="inherit">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Stock Miner
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
