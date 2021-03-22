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
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from "@material-ui/core/styles";

const SideBarTradeMenu = ({currentSelectedRow}) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        buy: {
            '& .MuiButtonBase-root.StockMiner-BigButton:first-of-type': {
                marginTop: '36px'
            }
        },
        grid_box: {
            color: theme.palette.text.secondary,
            '& .MuiGrid-item:first-child': {},
            '& .MuiGrid-item:last-child': {
                textAlign: 'right',
                overflow: 'hidden'
            },
            '& + *': {
                marginTop: '16px'
            }
        }
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
     * Order field values.
     */
    const [currentSymbol, setCurrentSymbol] = useState("")
    const [currentEstimatedPrice, setCurrentEstimatedPrice] = useState("$0.00")
    const [orderAmount, setOrderAmount] = useState("")
    const [orderQuantity, setOrderQuantity] = useState(0.00)
    const [limitType, setLimitType] = useState("percent")
    const [limitBuyAmount, setLimitBuyAmount] = useState("")
    const [limitBuyAmountPlaceholder, setLimitBuyAmountPlaceholder] = useState("$0.00")
    const [limitSellAmount, setLimitSellAmount] = useState("")
    const [limitSellAmountPlaceholder, setLimitSellAmountPlaceholder] = useState("$0.00")
    const [limitBuyPercent, setLimitBuyPercent] = useState("")
    const [limitBuyPercentLabel, setLimitBuyPercentLabel] = useState("Buy Limit % ($0.00)")
    const [limitBuyPercentPlaceholder, setLimitBuyPercentPlaceholder] = useState("-0.00")
    const [limitSellPercent, setLimitSellPercent] = useState("")
    const [limitSellPercentLabel, setLimitSellPercentLabel] = useState("Sell Limit % ($0.00)")
    const [limitSellPercentPlaceholder, setLimitSellPercentPlaceholder] = useState("+0.00")

    /**
     * Input validation, error handling flags and condition state values.
     */
    const [reviewOrderClicked, setReviewOrderClicked] = useState(false)
    const [orderAmountError, setOrderAmountError] = useState(false)
    const [orderAmountHelperText, setOrderAmountHelperText] = useState({
        default: "",
        error: "Please provide an appropriate value."
    })
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
        default: "Will attempt to buy at specified % change.",
        error: "Please provide an appropriate value."
    })


    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
            setCurrentEstimatedPrice('$' + currentSelectedRow.price)
            setOrderQuantity(calcEstimatedShareQuantity(currentEstimatedPrice, orderAmount))
            updater = setInterval(() => {
                setCurrentEstimatedPrice('$' + currentSelectedRow.price)
            }, 1000)
        } else {
            setCurrentSymbol("")
            setOrderAmount("")
            setCurrentEstimatedPrice("$0.00")
            setLimitBuyAmount('')
            setLimitBuyAmountPlaceholder('$0.00')
            setLimitSellAmount('')
            setLimitSellAmountPlaceholder('$0.00')
            setLimitBuyPercent('')
            setLimitBuyPercentPlaceholder('-0.00')
            setLimitSellPercent('')
            setLimitSellPercentPlaceholder('+0.00')
            setOrderQuantity(0)
        }

        return () => clearInterval(updater)
    }, [currentSelectedRow])

    /**
     * Conditionally renders Limit fields based on the 'Limit Type' value selected.
     */
    const renderLimitFields = () => {
        if (limitType === 'price') {
            return (
                <>
                    <TextField
                        label="Buy Limit $"
                        placeholder={limitBuyAmountPlaceholder}
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitBuyAmount}
                        disabled={!currentSelectedRow}
                        helperText={limitBuyAmountError ? limitBuyAmountHelperText.error : limitBuyAmountHelperText.default}
                        error={limitBuyAmountError}
                        onChange={(e) => {
                            if (e.target.value) {
                                setLimitBuyAmount(handlePriceInput(e.target.value))
                            } else {
                                setLimitBuyAmount('')
                            }
                        }}
                    />
                    <TextField
                        label="Sell Limit $"
                        placeholder={limitSellAmountPlaceholder}
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitSellAmount}
                        disabled={!currentSelectedRow}
                        helperText={limitSellAmountError ? limitSellAmountHelperText.error : limitSellAmountHelperText.default}
                        error={limitSellAmountError}
                        onChange={(e) => {
                            if (e.target.value) {
                                setLimitSellAmount(handlePriceInput(e.target.value))
                            } else {
                                setLimitSellAmount('')
                            }
                        }}
                    />
                </>
            )
        } else if (limitType === 'percent') {
            return (
                <>
                    <TextField
                        label={limitBuyPercentLabel}
                        placeholder={limitBuyPercentPlaceholder}
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitBuyPercent}
                        disabled={!currentSelectedRow}
                        helperText={limitBuyPercentError ? limitBuyPercentHelperText.error : limitBuyPercentHelperText.default}
                        error={limitBuyPercentError}
                        onChange={(e) => {
                            let semi_cleaned_value = handlePercentInput(e.target.value)
                            setLimitBuyPercent(semi_cleaned_value)
                            let new_label = `Buy Limit % ($${calcUpdatLimitPercentLabel(semi_cleaned_value)})`
                            setLimitBuyPercentLabel(new_label)
                        }}
                    />
                    <TextField
                        label={limitSellPercentLabel}
                        placeholder={limitSellPercentPlaceholder}
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitSellPercent}
                        disabled={!currentSelectedRow}
                        helperText={limitSellPercentError ? limitSellPercentHelperText.error : limitSellPercentHelperText.default}
                        error={limitSellPercentError}
                        onChange={(e) => {
                            let semi_cleaned_value = handlePercentInput(e.target.value)
                            setLimitSellPercent(semi_cleaned_value)
                            setLimitSellPercentLabel(calcUpdatLimitPercentLabel(semi_cleaned_value))
                        }}
                    />
                </>
            )
        }
    }

    /**
     * Renders the correct sequence of buttons based on state of the app.
     */
    const renderOrderButtons = () => {
        if (currentSelectedRow) {

            if (!reviewOrderClicked) {
                return (
                    <>
                        <Button
                            className="StockMiner-BigButton"
                            size="large"
                            onClick={() => {
                                if (handleInputValidation()) {
                                    setReviewOrderClicked(true)
                                }
                            }}
                        >
                            Review Order
                        </Button>
                    </>
                )
            } else {
                return (
                    <>
                        <Button
                            className="StockMiner-BigButton"
                            size="large"
                        >
                            Submit Order
                        </Button>
                        <Button
                            className="StockMiner-BigButton"
                            variant="outlined"
                            size="large"
                            onClick={() => {
                                setReviewOrderClicked(false)
                            }}
                        >
                            Edit
                        </Button>
                    </>
                )
            }
        }
    }

    /**
     * Basic input handling for order field inputs.
     * @todo - Add more input validator conditions as needed.
     */
    const handleInputValidation = () => {

        // Check if any required fields are left empty
        if (!orderAmount) {
            setOrderAmountError(true)
            return false
        } else {
            setOrderAmountError(false)
        }

        return true
    }

    /**
     * Limited input sanitation on fields that accept price/amount values.
     */
    const handlePriceInput = (str_value) => {
        return str_value.replace(/[^0-9.]/g, '')
    }

    /**
     * Limited input sanitation on fields that accept percentage values.
     */
    const handlePercentInput = (str_value) => {
        return str_value.replace(/[^0-9.\-\+]/g, '')
    }

    /**
     * Calculate estimated share quantity.
     */
    const calcEstimatedShareQuantity = (price, amount) => {
        let clean_price = parseFloat(price.replace('$', ''))
        let clean_amount = parseFloat(amount.replace('$', ''))
        if (!clean_amount || clean_amount === NaN) clean_amount = 0
        if (!clean_price) clean_price = 0
        let result = (clean_amount / clean_price).toFixed(7)
        if (clean_price === 0 || clean_amount === 0) {
            return 0.00
        } else if (result) {
            return result
        }
    }

    /**
     * Creates the Limit Percent inputs' labels.
     * @todo - ... build this
     */
    const calcUpdatLimitPercentLabel = (percent) => {
        let cleaned_percent = percent.replace('+', '')
        let cleaned_price = currentEstimatedPrice.replace('$', '')
        let p = parseFloat(cleaned_percent)
        let x = parseFloat(cleaned_price)
        let y = (x * p) / 100
        let target_amount = parseFloat(cleaned_price) + y
        let decimal_parts = target_amount.toString().split(".")
        if (decimal_parts.length === 2) {
            if (decimal_parts[1].length > 6) {
                target_amount = parseFloat(target_amount + decimal_parts[1]).toFixed(7)
            }
        }
        return target_amount
    }

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
                    <FormGroup className={classes.buy}>
                        <TextField
                            label="Amount in USD"
                            placeholder="$0.00"
                            variant="outlined"
                            value={orderAmount}
                            disabled={!currentSelectedRow}
                            helperText={orderAmountError ? orderAmountHelperText.error : orderAmountHelperText.default}
                            error={orderAmountError}
                            onChange={(e) => {
                                if (e.target.value) {
                                    let cleaned_amount = handlePriceInput(e.target.value)
                                    setOrderAmount('$' + cleaned_amount)
                                    setOrderQuantity(calcEstimatedShareQuantity(currentEstimatedPrice, cleaned_amount))
                                } else {
                                    setOrderAmount('')
                                }
                            }}
                            InputLabelProps={{shrink: true}}
                            required
                        />

                        <TextField
                            select
                            label="Limit Type"
                            variant="outlined"
                            value={limitType}
                            InputLabelProps={{shrink: true}}
                            disabled={!currentSelectedRow}
                            onChange={(e) => {
                                setLimitType(e.target.value)
                            }}
                        >
                            <MenuItem key="price" value="price">Price Based</MenuItem>
                            <MenuItem key="percent" value="percent">Percentage Based</MenuItem>
                        </TextField>

                        {renderLimitFields()}

                        <Divider/>

                        <Grid container spacing={0} className={classes.grid_box}>
                            <Grid item xs={6}>
                                <Typography>
                                    Estimated Price
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    {currentEstimatedPrice}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} className={classes.grid_box}>
                            <Grid item xs={6}>
                                <Typography>
                                    Estimated {currentSymbol}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    {orderQuantity}
                                </Typography>
                            </Grid>
                        </Grid>

                        {renderOrderButtons()}
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
