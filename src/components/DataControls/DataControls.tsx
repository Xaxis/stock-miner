import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import TuneIcon from '@material-ui/icons/Tune'
import Typography from "@material-ui/core/Typography"
import {makeStyles} from '@material-ui/core/styles'

export default function DataControls() {
    const classes = makeStyles((theme) => ({
        root: {
            className: "data-controls",
        },
    }))

    return (
        <Grid container spacing={1} className={classes.root}>
            <Grid item xs={12}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<TuneIcon />}
                        aria-controls="data-controls-view"
                        id="data-controls-view"
                    >
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Data Controls
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
};
