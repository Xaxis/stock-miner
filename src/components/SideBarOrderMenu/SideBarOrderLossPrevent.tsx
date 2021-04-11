import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CheckBox from '@material-ui/core/CheckBox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {toMoneyValue, toPercentValue} from '../../libs/value_conversions'

const SideBarOrderLossPrevent = (props) => {
    const {
        disabled,
        variant,
        currentPrice,
        getLossPreventPercent,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    // const classes = makeStyles(theme => ({}))()

    /**
     * Accordion panel
     */
    const [expandedPanel, setExpandedPanel] = useState(false)
    const handleAccordionPanel = (panel) => () => {
        setExpandedPanel(expandedPanel ? false : true)
    }

    /**
     * Component states.
     */
    const [lossPreventAmount, setLossPreventAmount] = useState("")
    const [lossPreventPercent, setLossPreventPercent] = useState("")
    const [lossPreventPrice, setLossPreventPrice] = useState("")
    const [lossPreventAmountPlaceholder, setLossPreventAmountPlaceholder] = useState("$0.00")
    const [lossPreventPercentPlaceholder, setLossPreventPercentPlaceholder] = useState("0.00")
    const [lossPreventPricePlaceholder, setLossPreventPricePlaceholder] = useState("$0.00")

    /**
     * Loss Prevent TextField component helper text and error messages.
     */
    const [lossPreventError, setLossPreventError] = useState(false)
    const [lossPreventAmountHelperText, setLossPreventAmountHelperText] = useState({
        default: "Will auto sell at amount ($) decrease.",
        error: "Please provide an appropriate value."
    })
    const [lossPreventPercentHelperText, setLossPreventPercentHelperText] = useState({
        default: "Will auto sell at percent (%) decrease.",
        error: "Please provide an appropriate value."
    })
    const [lossPreventPriceHelperText, setLossPreventPriceHelperText] = useState({
        default: "Will auto sell at stock price ($) value.",
        error: "Please provide an appropriate value."
    })

    /**
     * Handle input of any/all the loss prevention fields. All of the loss prevention fieldsvare updated when any of
     * them are changed, as they all contain equivalent values.
     */
    const handleLossPreventionTranslation = (value, type) => {
        let amount_loss = ''
        let percent_loss = ''
        let price_loss = ''
        switch (type) {
            case 'amount':
                amount_loss = toMoneyValue(value)
                percent_loss = ((amount_loss / toMoneyValue(currentPrice)) * 100).toFixed(2)
                price_loss = (toMoneyValue(currentPrice) - amount_loss).toFixed(8)
                break
            case 'percent':
                percent_loss = toPercentValue(value)
                amount_loss = ((toMoneyValue(currentPrice) * parseFloat(percent_loss)) / 100).toFixed(8)
                price_loss = (toMoneyValue(currentPrice) - amount_loss).toFixed(8)
                break
            case 'price':
                price_loss = toMoneyValue(value)
                percent_loss = Math.abs((price_loss / toMoneyValue(currentPrice) * 100) - 100).toFixed(8)
                amount_loss = (toMoneyValue(currentPrice) - price_loss).toFixed(8)
                break
        }
        setLossPreventAmount('$' + (isNaN(amount_loss) ? '' : amount_loss))
        setLossPreventPercent(percent_loss)
        setLossPreventPrice('$' + (isNaN(price_loss) ? '' : price_loss))
    }

    return (
        <Accordion
            square
            expanded={expandedPanel}
            onChange={handleAccordionPanel()}
            disabled={disabled}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <FormControlLabel
                    control={<CheckBox checked={expandedPanel} disabled={disabled}/>}
                    label={"Loss Prevention"}
                />
            </AccordionSummary>
            <AccordionDetails>
                <TextField
                    label="Max Stock Amount Loss"
                    placeholder={lossPreventAmountPlaceholder}
                    variant="outlined"
                    InputLabelProps={{shrink: true}}
                    value={lossPreventAmount}
                    disabled={disabled}
                    helperText={lossPreventError ? lossPreventAmountHelperText.error : lossPreventAmountHelperText.default}
                    error={lossPreventError}
                    onChange={(e) => {
                        if (e.target.value) {
                            handleLossPreventionTranslation(e.target.value, 'amount')
                            getLossPreventPercent(toPercentValue(lossPreventPercent))
                        } else {
                            setLossPreventAmount('')
                            setLossPreventPercent('')
                            setLossPreventPrice('')
                        }
                    }}
                />
                <TextField
                    label="Max Stock Percent Loss"
                    placeholder={lossPreventPercentPlaceholder}
                    variant="outlined"
                    InputLabelProps={{shrink: true}}
                    value={lossPreventPercent}
                    disabled={disabled}
                    helperText={lossPreventError ? lossPreventPercentHelperText.error : lossPreventPercentHelperText.default}
                    error={lossPreventError}
                    onChange={(e) => {
                        if (e.target.value) {
                            handleLossPreventionTranslation(e.target.value, 'percent')
                            getLossPreventPercent(toPercentValue(lossPreventPercent))
                        } else {
                            setLossPreventAmount('')
                            setLossPreventPercent('')
                            setLossPreventPrice('')
                        }
                    }}
                />
                <TextField
                    label="Max Stock Price Loss"
                    placeholder={lossPreventPricePlaceholder}
                    variant="outlined"
                    InputLabelProps={{shrink: true}}
                    value={lossPreventPrice}
                    disabled={disabled}
                    helperText={lossPreventError ? lossPreventPriceHelperText.error : lossPreventPriceHelperText.default}
                    error={lossPreventError}
                    onChange={(e) => {
                        if (e.target.value) {
                            handleLossPreventionTranslation(e.target.value, 'price')
                            getLossPreventPercent(toPercentValue(lossPreventPercent))
                        } else {
                            setLossPreventAmount('')
                            setLossPreventPercent('')
                            setLossPreventPrice('')
                        }
                    }}
                />
            </AccordionDetails>
        </Accordion>
    )
}

SideBarOrderLossPrevent.propTypes = {
    disabled: PropTypes.any,
    currentPrice: PropTypes.any.isRequired,
    getLossPreventPercent: PropTypes.func.isRequired,
}

export default SideBarOrderLossPrevent
