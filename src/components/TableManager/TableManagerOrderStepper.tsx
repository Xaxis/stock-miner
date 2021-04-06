import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'

const TableManagerOrderStepper = (props) => {
    const {
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            width: '100%'
        }
    }))()

    /**
     * Component states.
     */
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
        }
    ])

    /**
     * Returns the step content object by its id.
     */
    const getStepContent = (step) => {
        if (steps.indexOf(step) !== -1) {
            return steps[step]
        } else {
            return {
                label: null,
                info: null
            }
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                    const stepProps = {}
                    const labelProps = {}
                    if (step.hasOwnProperty('info')) {
                        if (step.info) labelProps.optional = <Typography variant="caption">{step.info}</Typography>
                    }
                    return (
                        <Step key={index} {...stepProps}>
                            <StepLabel {...labelProps}>{step.label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
        </div>
    )
}

TableManagerOrderStepper.propTypes = {}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderStepper)