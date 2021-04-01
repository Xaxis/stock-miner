import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Collapse from '@material-ui/core/Collapse'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TableManagerOrderDetail from './TableManagerOrderDetail'
import TableManagerOrderHistory from './TableManagerOrderHistory'
import TableManagerOrderBasic from "./TableManagerOrderBasic";

const TableManagerExpandableRow = (props) => {
    const {
        rowData,
        rowMeta,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        table_row: {
            backgroundColor: theme.palette.secondary.dark,
            '&:hover': {
                backgroundColor: `${theme.palette.secondary.dark} !important`
            }
        },
        table_cell: {
            padding: '0'
        }
    }))()

    /**
     * Accordion panels
     */
    const [expandedPanel1, setExpandedPanel1] = useState(false)
    const [expandedPanel2, setExpandedPanel2] = useState(false)
    const [expandedPanel3, setExpandedPanel3] = useState(true)

    /**
     * Toggle handler sets state on accordion panels
     */
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
        <TableRow className={classes.table_row}>
            <TableCell colSpan={42} className={classes.table_cell}>
                <Collapse in={true}>
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
                </Collapse>
            </TableCell>
        </TableRow>
    )
}

TableManagerExpandableRow.propTypes = {
    rowData: PropTypes.any.isRequired,
    rowMeta: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerExpandableRow)