import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

const TableManagerOrderStepper = (props) => {
    const {
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
        }
    }))()

    /**
     * Component states.
     */
    const [activeStep, setActiveStep] = useState(0)

    return (
        <div className={classes.root}>
            TEST
            {/*<Stepper activeStep={activeStep}>*/}
            {/*    WIKKIY WIKIY WAK!*/}
            {/*</Stepper>*/}

        </div>
    )
}

TableManagerOrderStepper.propTypes = {
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