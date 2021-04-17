import * as React from 'react'
import clsx from 'clsx'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import OrderStatusMenu from '../OrderStatusChip/OrderStatusMenu'
import Chip from '@material-ui/core/Chip'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import DownArrowIcon from '@material-ui/icons/ArrowDropDownCircle'

const TableManagerOrderStepper = (props) => {
    const {
        row,
        tableData,
        currentSelectedRow,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            width: '100%',
            padding: '8px',
            '& .MuiTypography-root': {
                color: theme.palette.text.disabled
            },
            '& .MuiTypography-root.MuiStepLabel-completed': {
                color: theme.palette.text.primary
            },
            '& .MuiTypography-root.MuiStepLabel-completed + .MuiTypography-caption': {
                color: theme.palette.text.primary
            },
            '& .MuiStepConnector-line': {
                borderColor: `${theme.palette.status.paused.main}`
            },
            '& .MuiStepConnector-completed .MuiStepConnector-line': {
                borderColor: `${theme.palette.text.secondary}`
            },
            '& .MuiChip-root': {
                height: 'auto',
                border: 'none',
                '&:hover, &:focus': {
                    backgroundColor: 'transparent'
                },
                '& .MuiChip-label': {
                    paddingLeft: 0,
                    fontSize: '0.75rem',
                },
                '&:hover .MuiSvgIcon-root': {
                    color: theme.palette.text.secondary
                },
                '& .MuiSvgIcon-root': {
                    backgroundColor: 'transparent',
                    color: theme.palette.secondary.main
                },
                '& .MuiTouchRipple-root': {
                    display: 'none'
                }
            }
        },
        step: {
            '& .MuiStepIcon-root': {
                color: `${theme.palette.secondary.dark}`
            }
        },
        registered: {
            '& .MuiStepIcon-completed': {
                color: `${theme.palette.status.registered.main}`
            }
        },
        running: {
            '& .MuiStepIcon-completed': {
                color: `${theme.palette.status.running.main}`
            }
        },
        finished: {
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
    const [status, setStatus] = useState(row.status)
    const [tasks, setTasks] = useState(JSON.parse(row.tasks))
    const [anchorEl, setAnchorEl] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [steps, setSteps] = useState([
        {
            label: 'Registered',
            info: 'Order being watched.'
        },
        {
            label: 'Running',
            info: 'Order processing tasks.'
        },
        {
            label: 'Finished',
            info: 'Order has sold.'
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
    }, [tableData])

    /**
     * Update selected row's tasks
     */
    useEffect(() => {
        if (currentSelectedRow) {
            setTasks(JSON.parse(currentSelectedRow.tasks))
        }
    }, [currentSelectedRow])

    /**
     * Handle menu open.
     */
    const handleMenuOpen = (e, target) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(target)
    }

    /**
     * Handle menu close.
     */
    const handleMenuClose = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(null)
    }

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
                    const statusChip =
                        <>
                            <Chip
                                clickable={true}
                                label={step.label}
                                variant="outlined"
                                onClick={(e) => {
                                    handleMenuOpen(e, e.currentTarget)
                                }}
                                onDelete={(e) => {
                                    handleMenuOpen(e, e.target.closest('.MuiChip-root'))
                                }}
                                deleteIcon={<DownArrowIcon/>}
                            />
                            <OrderStatusMenu
                                status={step.label}
                                tasks={tasks}
                                anchorEl={anchorEl}
                                onMenuClose={handleMenuClose}
                            />
                        </>
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
                            <StepLabel {...labelProps}>
                                {(active_step-1 === index) ? statusChip : step.label}
                            </StepLabel>
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
    row: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        currentSelectedRow: state.currentSelectedRow,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderStepper)