import * as React from 'react'
import clsx from 'clsx'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";

const TableManagerOrderStepper = (props) => {
    const {
        uuid,
        row,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            width: '100%',
            padding: '8px',
            '& .MuiStepConnector-line': {
                borderColor: `${theme.palette.status.paused.main}`
            },
            '& .MuiStepConnector-completed .MuiStepConnector-line': {
                borderColor: `${theme.palette.text.primary}`
            },
        },
        step: {
            '& .MuiStepIcon-root': {
                color: `${theme.palette.secondary.dark}`
            }
        },
        registered: {
            '& .MuiStepIcon-active': {
                color: `${theme.palette.status.registered.alt}`
            },
            '& .MuiStepIcon-completed': {
                color: `${theme.palette.status.registered.main}`
            }
        },
        running: {
            '& .MuiStepIcon-active': {
                color: `${theme.palette.status.running.alt}`
            },
            '& .MuiStepIcon-completed': {
                color: `${theme.palette.status.running.main}`
            }
        },
        finished: {
            '& .MuiStepIcon-active': {
                color: `${theme.palette.status.finished.alt}`
            },
            '& .MuiStepIcon-completed': {
                color: `${theme.palette.status.finished.main}`
            }
        },
        paused: {
            '& .MuiStepIcon-active, .MuiStepIcon-completed': {
                color: `${theme.palette.status.paused.main}`
            }
        }
    }))()

    /**
     * Component states.
     */
    const [status, setStatus] = useState('Registered')
    const [activeStep, setActiveStep] = useState(0)
    const [steps, setSteps] = useState([
        {
            label: 'Registered',
            info: 'Order is being watched.'
        },
        {
            label: 'Running',
            info: 'Order tasks are executing.'
        },
        {
            label: 'Finished',
            info: 'Order has ended.'
        },
        {
            label: 'Paused',
            info: 'Order tasks are paused.'
        }
    ])
    const [standardSteps, setStandardSteps] = useState([steps[0], steps[1], steps[2]])
    const [pausedSteps, setPausedSteps] = useState([steps[0], steps[3], steps[2]])

    /**
     * Update status progress based on current order status.
     */
    useEffect(() => {
        if (row) {
            setStatus(row.status)
            switch (row.status) {
                case 'Registered' :
                    setActiveStep(1)
                    break
                case 'Running' :
                    setActiveStep(2)
                    break
                case 'Finished' :
                    setActiveStep(3)
                    break
                case 'Paused' :
                    setActiveStep(2)
                    break
            }
        }
    }, [tableData])

    /**
     * Returns the step id based on a status string.
     */
    const getStatusStep = (status) => {
        switch (row.status) {
            case 'Registered' :
                return 1
            case 'Running' :
                return 2
            case 'Finished' :
                return 3
            case 'Paused' :
                return 2
        }
    }

    /**
     * Renders the stepper based on the status of the order.
     */
    const renderStepper = (status, active_step) => {
        let steps_arr = status === 'Paused' ? pausedSteps : standardSteps
        return (
            <Stepper className={classes.root} activeStep={active_step}>
                {steps_arr.map((step, index) => {
                    const stepProps = {}
                    const labelProps = {}
                    if (step.hasOwnProperty('info')) {
                        if (step.info) labelProps.optional = <Typography variant="caption">{step.info}</Typography>
                    }
                    return (
                        <Step
                            className={clsx(classes.step, {
                                [classes[step.label.toLowerCase()]]: true,
                            })}
                            key={index}
                            {...stepProps}
                        >
                            <StepLabel {...labelProps}>{step.label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
        )
    }

    return (
        <>
            {renderStepper(row.status, getStatusStep(row.status))}
        </>
    )
}

TableManagerOrderStepper.propTypes = {
    uuid: PropTypes.any.isRequired,
    row: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderStepper)