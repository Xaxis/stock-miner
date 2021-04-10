import * as React from 'react'
import {useState, useEffect} from 'react'
import fetch from 'cross-fetch'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function SideBarControlsMenu() {
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [taskFrequencyValue, setTaskFrequencyValue] = useState('1000')
    const [pollingFrequencyValue, setPollingFrequencyValue] = useState('1000')
    const taskFrequencyOptions = [
        {
            value: '1000',
            label: 'Live'
        },
        {
            value: '3000',
            label: '3 seconds'
        },
        {
            value: '5000',
            label: '5 seconds'
        },
        {
            value: '10000',
            label: '10 seconds'
        },
        {
            value: '30000',
            label: '30 seconds'
        },
        {
            value: '60000',
            label: '1 minute'
        }
    ]
    const pollingFrequencyOptions = [
        {
            value: '1000',
            label: 'Live'
        },
        {
            value: '3000',
            label: '3 seconds'
        },
        {
            value: '5000',
            label: '5 seconds'
        },
        {
            value: '10000',
            label: '10 seconds'
        },
        {
            value: '30000',
            label: '30 seconds'
        },
        {
            value: '60000',
            label: '1 minute'
        }
    ]

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    /**
     * Update the task frequency value.
     */
    const handleTaskFrequencyUpdate = (e) => {
        (async () => {
            let value = e.target.value
            const response = await fetch(`http://localhost:2222/app/set/taskfrequency/${value}`)
            setTaskFrequencyValue(value)
        })()
    }

    /**
     * Update the polling frequency value.
     */
    const handlePollingFrequencyUpdate = (e) => {
        (async () => {
            let value = e.target.value
            const response = await fetch(`http://localhost:2222/app/set/pollingfrequency/${value}`)
            setPollingFrequencyValue(value)
        })()
    }

    /**
     * Handle setting controls based on app config in the database.
     */
    useEffect(() => {
        (async () => {
            const response = await fetch(`http://localhost:2222/app/get/config`)
            let config = await response.json()
            setTaskFrequencyValue(config.task_frequency)
            setPollingFrequencyValue(config.polling_frequency)
        })()
    })

    return (
        <div>
            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-controls-panel1"
                >
                    <Typography>Controls</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            select
                            label="Task Frequency"
                            value={taskFrequencyValue}
                            helperText="How frequently server side tasks are executed."
                            variant="outlined"
                            onChange={handleTaskFrequencyUpdate}
                        >
                            {taskFrequencyOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Polling Frequency"
                            value={pollingFrequencyValue}
                            helperText="How frequently data is updated on the frontend."
                            variant="outlined"
                            onChange={handlePollingFrequencyUpdate}
                        >
                            {pollingFrequencyOptions.map((option) => (
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
