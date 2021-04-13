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
import MenuItem from '@material-ui/core/MenuItem'
import {toMoneyValue, toPercentValue, toSmartFixed, convertTemplateString, calcPercent, calcStockSumWithPercentageChange} from '../../libs/value_conversions'

const SideBarOrderLimit = (props) => {
    const {
        disabled,
        variant,
        currentPrice,
        getLimitBuyAmount,
        getLimitSellAmount,
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
    const [limitType, setLimitType] = useState("amount")
    const [limitBuyAmount, setLimitBuyAmount] = useState("")
    const [limitSellAmount, setLimitSellAmount] = useState("")
    const [limitBuyPercent, setLimitBuyPercent] = useState("")
    const [limitSellPercent, setLimitSellPercent] = useState("")
    const [limitBuyAmountPlaceholder, setLimitBuyAmountPlaceholder] = useState("$0.00")
    const [limitSellAmountPlaceholder, setLimitSellAmountPlaceholder] = useState("$0.00")
    const [limitBuyPercentLabelTemplate, setLimitBuyPercentLabelTemplate] = useState("Buy Limit % (${0})")
    const [limitSellPercentLabelTemplate, setLimitSellPercentLabelTemplate] = useState("Sell Limit % (${0})")
    const [limitBuyPercentLabel, setLimitBuyPercentLabel] = useState(convertTemplateString(limitBuyPercentLabelTemplate, ['0.00']))
    const [limitSellPercentLabel, setLimitSellPercentLabel] = useState(convertTemplateString(limitSellPercentLabelTemplate, ['0.00']))
    const [limitBuyPercentPlaceholder, setLimitBuyPercentPlaceholder] = useState("0.00")
    const [limitSellPercentPlaceholder, setLimitSellPercentPlaceholder] = useState("0.00")

    /**
     * Limit TextField component helper text and error messages.
     */
    const [limitBuyAmountError, setLimitBuyAmountError] = useState(false)
    const [limitBuyAmountHelperText, setLimitBuyAmountHelperText] = useState({
        default: "Will attempt to buy at specified price.",
        error: "Please provide an appropriate value."
    })
    const [limitSellAmountError, setLimitSellAmountError] = useState(false)
    const [limitSellAmountHelperText, setLimitSellAmountHelperText] = useState({
        default: "Will attempt to sell at specified price.",
        error: "Please provide an appropriate value."
    })
    const [limitBuyPercentError, setLimitBuyPercentError] = useState(false)
    const [limitBuyPercentHelperText, setLimitBuyPercentHelperText] = useState({
        default: "Will attempt to buy at specified % change.",
        error: "Please provide an appropriate value."
    })
    const [limitSellPercentError, setLimitSellPercentError] = useState(false)
    const [limitSellPercentHelperText, setLimitSellPercentHelperText] = useState({
        default: "Will attempt to sell at specified % change.",
        error: "Please provide an appropriate value."
    })

    /**
     * Update values with each currentPrice update.
     */
    useEffect(() => {
        let stockBuyChangeAmount = calcStockSumWithPercentageChange(toPercentValue(limitBuyPercent), toMoneyValue(currentPrice))
        let stockSellChangeAmount = calcStockSumWithPercentageChange(toPercentValue(limitSellPercent), toMoneyValue(currentPrice))
        setLimitBuyPercentLabel(convertTemplateString(limitBuyPercentLabelTemplate, [isNaN(stockBuyChangeAmount) ? '0.00' : toSmartFixed(stockBuyChangeAmount)]))
        setLimitSellPercentLabel(convertTemplateString(limitSellPercentLabelTemplate, [isNaN(stockSellChangeAmount) ? '0.00' : toSmartFixed(stockSellChangeAmount)]))
    }, [currentPrice])

    /**
     * All TextField components defined here for ease of use conditionally.
     */
    const TextFieldBuyLimitAmount = () => {
        return (
            <TextField
                label="Buy At Stock $"
                placeholder={limitBuyAmountPlaceholder}
                variant="outlined"
                InputLabelProps={{shrink: true}}
                value={limitBuyAmount}
                disabled={disabled}
                helperText={limitBuyAmountError ? limitBuyAmountHelperText.error : limitBuyAmountHelperText.default}
                error={limitBuyAmountError}
                onChange={(e) => {
                    if (e.target.value) {
                        let cleanLimitBuyAmount = toMoneyValue(e.target.value)
                        setLimitBuyAmount('$' + cleanLimitBuyAmount)
                        getLimitBuyAmount(cleanLimitBuyAmount)
                    } else {
                        setLimitBuyAmount('')
                    }
                }}
            />
        )
    }
    const TextFieldSellLimitAmount = () => {
        return (
            <TextField
                label="Sell At Stock $"
                placeholder={limitSellAmountPlaceholder}
                variant="outlined"
                InputLabelProps={{shrink: true}}
                value={limitSellAmount}
                disabled={disabled}
                helperText={limitSellAmountError ? limitSellAmountHelperText.error : limitSellAmountHelperText.default}
                error={limitSellAmountError}
                onChange={(e) => {
                    if (e.target.value) {
                        let cleanLimitSellAmount = toMoneyValue(e.target.value)
                        setLimitSellAmount('$' + cleanLimitSellAmount)
                        getLimitSellAmount(cleanLimitSellAmount)
                    } else {
                        setLimitSellAmount('')
                    }
                }}
            />
        )
    }
    const TextFieldBuyLimitPercent = () => {
        return (
            <TextField
                label={limitBuyPercentLabel}
                placeholder={limitBuyPercentPlaceholder}
                variant="outlined"
                InputLabelProps={{shrink: true}}
                value={limitBuyPercent}
                disabled={disabled}
                helperText={limitBuyPercentError ? limitBuyPercentHelperText.error : limitBuyPercentHelperText.default}
                error={limitBuyPercentError}
                onChange={(e) => {
                    let cleanLimitBuyPercent = toPercentValue(e.target.value)
                    let stockChangeAmount = calcStockSumWithPercentageChange(cleanLimitBuyPercent, toMoneyValue(currentPrice))
                    setLimitBuyPercent(cleanLimitBuyPercent)
                    setLimitBuyPercentLabel(convertTemplateString(limitBuyPercentLabelTemplate, [isNaN(stockChangeAmount) ? '0.00' : stockChangeAmount]))
                }}
            />
        )
    }
    const TextFieldSellLimitPercent = () => {
        return (
            <TextField
                label={limitSellPercentLabel}
                placeholder={limitSellPercentPlaceholder}
                variant="outlined"
                InputLabelProps={{shrink: true}}
                value={limitSellPercent}
                disabled={disabled}
                helperText={limitSellPercentError ? limitSellPercentHelperText.error : limitSellPercentHelperText.default}
                error={limitSellPercentError}
                onChange={(e) => {
                    let cleanLimitSellPercent = toPercentValue(e.target.value)
                    let stockChangeAmount = calcStockSumWithPercentageChange(cleanLimitSellPercent, toMoneyValue(currentPrice))
                    setLimitSellPercent(cleanLimitSellPercent)
                    setLimitSellPercentLabel(convertTemplateString(limitSellPercentLabelTemplate, [isNaN(stockChangeAmount) ? '0.00' : stockChangeAmount]))
                }}
            />
        )
    }

    /**
     * Conditionally renders Limit fields based on 'variant' property: 'both' fields, 'buy' fields only, or
     * 'sell' fields only.
     */
    const LimitFields = () => {
        if (variant === 'both') {
            if (limitType === 'amount') {
                return (
                    <>
                        {TextFieldBuyLimitAmount()}
                        {TextFieldSellLimitAmount()}
                    </>
                )
            } else if (limitType === 'percent') {
                return (
                    <>
                        {TextFieldBuyLimitPercent()}
                        {TextFieldSellLimitPercent()}
                    </>
                )
            }
        } else if (variant === 'buy') {
            if (limitType === 'amount') {
                return (
                    <>
                        {TextFieldBuyLimitAmount()}
                    </>
                )
            } else if (limitType === 'percent') {
                return (
                    <>
                        {TextFieldBuyLimitPercent()}
                    </>
                )
            }
        } else if (variant === 'sell') {
            if (limitType === 'amount') {
                return (
                    <>
                        {TextFieldSellLimitAmount()}
                    </>
                )
            } else if (limitType === 'percent') {
                return (
                    <>
                        {TextFieldSellLimitPercent()}
                    </>
                )
            }
        }
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
                    label={"Limit Order"}
                />
            </AccordionSummary>
            <AccordionDetails>
                <TextField
                    select
                    label="Limit Type"
                    variant="outlined"
                    value={limitType}
                    InputLabelProps={{shrink: true}}
                    disabled={disabled}
                    onChange={(e) => {
                        setLimitType(e.target.value)
                        if (e.target.value === 'amount') {
                            if (limitBuyPercent) {
                                let buyAmountDiff = (toMoneyValue(currentPrice) * parseFloat(limitBuyPercent * -1)) / 100
                                setLimitBuyAmount('$' + toSmartFixed((toMoneyValue(currentPrice) - buyAmountDiff)))
                            }
                            if (limitSellPercent) {
                                let sellAmountDiff = (toMoneyValue(currentPrice) * parseFloat(limitSellPercent * -1)) / 100
                                setLimitSellAmount('$' + toSmartFixed((toMoneyValue(currentPrice) - sellAmountDiff)))
                            }
                        } else if (e.target.value === 'percent') {
                            if (limitBuyAmount) {
                                let limitPercent = calcPercent(toMoneyValue(limitBuyAmount), toMoneyValue(currentPrice))
                                setLimitBuyPercent(toSmartFixed((limitPercent - 100)))
                            }
                            if (limitSellAmount) {
                                let limitPercent = calcPercent(toMoneyValue(limitSellAmount), toMoneyValue(currentPrice))
                                setLimitSellPercent(toSmartFixed(limitPercent - 100))
                            }
                        }
                    }}
                >
                    <MenuItem key="amount" value="amount">Amount Based</MenuItem>
                    <MenuItem key="percent" value="percent">Percentage Based</MenuItem>
                </TextField>
                {LimitFields()}
            </AccordionDetails>
        </Accordion>
    )
}

SideBarOrderLimit.propTypes = {
    disabled: PropTypes.any,
    variant: PropTypes.string.isRequired,
    currentPrice: PropTypes.any.isRequired,
    getLimitBuyAmount: PropTypes.func.isRequired,
    getLimitSellAmount: PropTypes.func.isRequired,
}

export default SideBarOrderLimit
