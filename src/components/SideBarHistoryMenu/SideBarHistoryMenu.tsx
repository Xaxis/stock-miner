import * as React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function SideBarHistoryMenu() {
    const [expandedPanel1, setExpandedPanel1] = React.useState(true)
    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    return (
        <div>
            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-controls-panel1"
                    id="sidebar-controls-panel1"
                >
                    <Typography>History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lots of junk goes here.
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    );
};
