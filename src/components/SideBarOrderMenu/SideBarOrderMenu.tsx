import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import SideBarOrderMenuBuy from './SideBarOrderMenuBuy'

const SideBarOrderMenu = ({currentSelectedRow}) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {}
    }))()

    /**
     * Handle toggling the Buy accordion.
     */
    const [expandedPanel1, setExpandedPanel1] = useState(true)
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

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
        } else {
            setCurrentSymbol("")
        }

        return () => clearInterval(updater)
    }, [currentSelectedRow])

    return (
        <div>
            <Accordion square expanded={expandedPanel1} onChange={handleTogglePanel1()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>
                        Buy&nbsp;
                        <span>{currentSymbol}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {<SideBarOrderMenuBuy/>}
                </AccordionDetails>
            </Accordion>

            <Accordion square expanded={expandedPanel2} onChange={handleTogglePanel2()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel2"
                >
                    <Typography>
                        Sell&nbsp;
                        <span className="current-selected-trade-symbol">{currentSymbol}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        currentSelectedRow: state.currentSelectedRow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarOrderMenu)