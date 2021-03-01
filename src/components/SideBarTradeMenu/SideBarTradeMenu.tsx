import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function SideBarTradeMenu() {
    const [expandedPanel1, setExpandedPanel1] = React.useState(true)
    const classes = makeStyles((theme) => ({
        root: {
            width: '100%'
        }
    }))()

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    return (
        <div className={classes.root}>
            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel1"
                    id="sidebar-trade-panel1"
                >
                    <Typography>Buy</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel2"
                    id="sidebar-trade-panel2"
                >
                    <Typography>Sell</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots
                        of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of
                        junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk
                        goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes
                        here.
                        Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots
                        of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of
                        junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk
                        goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes
                        here.
                        Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots
                        of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of
                        junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk
                        goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes
                        here.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel3"
                    id="sidebar-trade-panel3"
                >
                    <Typography>Spread Order</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots
                        of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of
                        junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk
                        goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes here.Lots of junk goes
                        here.

                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    );
};
