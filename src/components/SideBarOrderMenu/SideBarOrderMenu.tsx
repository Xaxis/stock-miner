import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SideBarOrderMenuBuy from './SideBarOrderMenuBuy'
import SideBarOrderMenuSell from './SideBarOrderMenuSell'
import {isTaskDone} from '../../libs/state_modifiers'

const SideBarOrderMenu = ({tableData, currentSelectedRow}) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        symbol: {
            color: `${theme.palette.primary.light}`
        }
    }))()

    /**
     * Handle toggling the Buy accordion.
     */
    const [expandedPanel1, setExpandedPanel1] = useState(false)
    const handleTogglePanel1 = (panel) => (event) => {
        setExpandedPanel1(!expandedPanel1)
        setExpandedPanel2(false)
    }

    /**
     * Handle toggling the Sell accordion.
     */
    const [expandedPanel2, setExpandedPanel2] = useState(false)
    const handleTogglePanel2 = (panel) => (event) => {
        setExpandedPanel2(!expandedPanel2)
        setExpandedPanel1(false)
    }

    /**
     * Current selected row/trade states.
     */
    const [currentSymbol, setCurrentSymbol] = useState("")
    const [tasks, setTasks] = useState(null)

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
        } else {
            setCurrentSymbol("")
        }
    }, [currentSelectedRow])

    /**
     * Continually update tasks object.
     */
    useEffect(() => {
        if (currentSelectedRow) {
            setTasks(JSON.parse(currentSelectedRow.tasks))
        }
    }, [tableData])

    /**
     * Set the Buy menu disabled if Buy orders can no longer be placed.
     */
    const isBuyMenuDisabled = (tasks) => {
        return (
            !isTaskDone(tasks, 'REGISTERED')
            || isTaskDone(tasks, 'SELL')
        )
    }

    /**
     * Set the Sell menu disabled if Sell orders can no longer be placed.
     */
    const isSellMenuDisabled = (tasks) => {
        return (
            !isTaskDone(tasks, 'BUY')
        )
    }

    return (
        <div>
            <Accordion
                square
                expanded={expandedPanel1}
                onChange={handleTogglePanel1()}
                disabled={isBuyMenuDisabled(tasks)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>
                        Buy&nbsp;
                        <span className={classes.symbol}>{currentSymbol}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {<SideBarOrderMenuBuy/>}
                </AccordionDetails>
            </Accordion>

            <Accordion
                square
                expanded={expandedPanel2}
                onChange={handleTogglePanel2()}
                disabled={isSellMenuDisabled(tasks)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>
                        Sell&nbsp;
                        <span className={classes.symbol}>{currentSymbol}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {<SideBarOrderMenuSell/>}
                </AccordionDetails>
            </Accordion>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        currentSelectedRow: state.currentSelectedRow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarOrderMenu)
