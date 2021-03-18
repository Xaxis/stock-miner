import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const SideBarTradeMenu = ({currentSelectedRow}) => {
    const [expandedPanel1, setExpandedPanel1] = useState(false)
    const handleTogglePanel1 = (panel) => (event) => {
        setExpandedPanel1(!expandedPanel1)
    }
    const [expandedPanel2, setExpandedPanel2] = useState(false)
    const handleTogglePanel2 = (panel) => (event) => {
        setExpandedPanel2(!expandedPanel2)
    }

    const [currentSymbol, setCurrentSymbol] = useState("")
    const [currentEstimatedPrice, setCurrentEstimatedPrice] = useState("$0.00")

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
            setCurrentEstimatedPrice("$" + currentSelectedRow.price)
            updater = setInterval(() => {
                setCurrentEstimatedPrice("$" + currentSelectedRow.price)
            }, 1000)
        } else {
            setCurrentSymbol("")
            setCurrentEstimatedPrice("$0.00")
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
                        <span className="current-selected-trade-symbol">{currentSymbol}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            label="Estimated Price"
                            placeholder={currentEstimatedPrice}
                            variant="outlined"
                            value={currentEstimatedPrice}
                            InputProps={{readOnly: false}}
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            label="Amount to Buy"
                            placeholder="$0.00"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            label="Buy Limit"
                            placeholder="$0.00"
                            helperText="Price to buy at"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            label="Sell Limit"
                            placeholder="$0.00"
                            helperText="Price to sell at"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                        <Button
                            className="StockMinerBigButton"
                            size="large"
                        >
                            Review Order
                        </Button>
                    </FormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(SideBarTradeMenu)
