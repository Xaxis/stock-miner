import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TableManagerOrderBasic from '../TableManager/TableManagerOrderBasic'
import TableManagerOrderDetail from '../TableManager/TableManagerOrderDetail'
import TableManagerOrderHistory from '../TableManager/TableManagerOrderHistory'
import TableManagerOrderStepper from '../TableManager/TableManagerOrderStepper'

const OrderDetailView = (props) => {
    const {
        rowData,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({}))()

    /**
     * Accordion panels
     */
    const [expandedPanel0, setExpandedPanel0] = useState(true)
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [expandedPanel2, setExpandedPanel2] = useState(true)
    const [expandedPanel3, setExpandedPanel3] = useState(true)

    /**
     * Toggle handler sets state on accordion panels
     */
    const handleAccordionPanelExpand0 = (panel) => (event) => {
        setExpandedPanel0(expandedPanel0 ? false : true)
    }
    const handleAccordionPanelExpand1 = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }
    const handleAccordionPanelExpand2 = (panel) => (event) => {
        setExpandedPanel2(expandedPanel2 ? false : true)
    }
    const handleAccordionPanelExpand3 = (panel) => (event) => {
        setExpandedPanel3(expandedPanel3 ? false : true)
    }

    return (
        <>
            <Accordion
                square
                expanded={expandedPanel0}
                onChange={handleAccordionPanelExpand0()}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Order Progress</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableManagerOrderStepper/>
                </AccordionDetails>
            </Accordion>

            <Accordion
                square
                expanded={expandedPanel1}
                onChange={handleAccordionPanelExpand1()}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Order Overview</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableManagerOrderBasic rowData={rowData}/>
                </AccordionDetails>
            </Accordion>

            <Accordion
                square
                expanded={expandedPanel2}
                onChange={handleAccordionPanelExpand2()}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Order Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableManagerOrderDetail rowData={rowData}/>
                </AccordionDetails>
            </Accordion>

            <Accordion
                square
                expanded={expandedPanel3}
                onChange={handleAccordionPanelExpand3()}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Order History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableManagerOrderHistory uuid={rowData[0]}/>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

OrderDetailView.propTypes = {
    rowData: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailView)