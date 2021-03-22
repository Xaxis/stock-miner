import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

export default function StatusBar() {
    const classes = makeStyles((theme) => ({
        root: {
            position: 'fixed',
            height: '24px',
            bottom: '0px',
            backgroundColor: theme.palette.secondary.dark,
            borderTop: `1px solid ${theme.palette.secondary.main}`,
            color: theme.palette.text.secondary,
            zIndex: '9999'
        }
    }))()

    return (
        <Grid container spacing={1} className={classes.root}>
            <Grid item xs={12}>
                <Typography>
                </Typography>
            </Grid>
        </Grid>
    );
};
