import * as React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function SideBarControlsMenu() {
    const [expandedPanel1, setExpandedPanel1] = React.useState(true)
    const [frequencyValue, setFrequencyValue] = React.useState('live')
    const [timespanValue, setTimespanValue] = React.useState('1d')
    const frequencyOptions = [
        {
            value: 'live',
            label: 'Live'
        },
        {
            value: '5s',
            label: '5 seconds'
        },
        {
            value: '15s',
            label: '15 seconds'
        },
        {
            value: '30s',
            label: '30 seconds'
        },
        {
            value: '1m',
            label: '1 minute'
        }
    ]
    const timespanOptions = [
        {
            value: 'live',
            label: 'Live'
        },
        {
            value: '1d',
            label: '1 day'
        },
        {
            value: '1w',
            label: '1 week'
        },
        {
            value: '1m',
            label: '1 month'
        },
        {
            value: '3m',
            label: '3 months'
        },
        {
            value: '6m',
            label: '6 months'
        },
        {
            value: '1y',
            label: '1 year'
        },
        {
            value: '5y',
            label: '5 years'
        },
    ]

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
                    <Typography>Controls</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            id="sidebar-controls-frequency"
                            select
                            label="Polling Frequency"
                            value={frequencyValue}
                            helperText="Select polling frequency"
                            variant="outlined"
                        >
                            {frequencyOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            id="sidebar-controls-timespan"
                            select
                            label="Time Span"
                            value={timespanValue}
                            helperText="Select time span value"
                            variant="outlined"
                        >
                            {timespanOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormGroup>

                </AccordionDetails>
            </Accordion>

        </div>
    );
};
