import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import fetch from 'cross-fetch'
import CircularProgress from '@material-ui/core/CircularProgress'

const SideBarOrderMenuBuy = (props) => {
    const {
        profileActive,
        tableIDActive,
        tableTypeActive,
        currentSelectedRow,
        setSelectedRow,
        updateTableRows
        ...other
    } = props;

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
        },
        button_progress: {
            color: theme.palette.text.primary,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
            zIndex: 1
        }
    }))()

    /**
     * Order field values.
     */
    const [currentSymbol, setCurrentSymbol] = useState("")
    const [currentEstimatedPrice, setCurrentEstimatedPrice] = useState("$0.00")
    const [orderAmount, setOrderAmount] = useState("")
    const [orderQuantity, setOrderQuantity] = useState(0.00)
    const [limitType, setLimitType] = useState("price")
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
    const [orderProcessing, setOrderProcessing] = useState(false)
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

                // Update the estimated price
                setCurrentEstimatedPrice('$' + currentSelectedRow.price)

                // Update amount values in real time when percent limits are active
                if (limitType === 'percent') {
                    if (limitBuyPercent) {
                        let buy_percent = handlePercentInput(limitBuyPercent)
                        calcUpdatLimitPercentLabelTranslation(
                            buy_percent,
                            setLimitBuyPercentLabel,
                            'Buy Limit %',
                            setLimitBuyAmount,
                            currentSelectedRow.price
                        )
                    }
                    if (limitSellPercent) {
                        let sell_percent = handlePercentInput(limitSellPercent)
                        calcUpdatLimitPercentLabelTranslation(
                            sell_percent,
                            setLimitSellPercentLabel,
                            'Sell Limit %',
                            setLimitSellAmount,
                            currentSelectedRow.price
                        )
                    }
                }
            }, 1000)
        } else {
            resetBuyInputs()
        }

        return () => clearInterval(updater)
    }, [currentSelectedRow, limitType, limitBuyPercent, limitSellPercent])

    /**
     * Reset the inputs when the table ID active changes.
     */
    useEffect(() => {
        resetBuyInputs()
    }, [tableIDActive])

    /**
     * Resets the Buy Inputs with their initial values.
     * @todo - Make sure this works.
     */
    const resetBuyInputs = () => {
        setSelectedRow(null)

        // Reset input values
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
        setLimitBuyPercentLabel('Buy Limit % ($0.00)')
        setLimitSellPercentLabel('Sell Limit % ($0.00)')

        // Reset error flags
        setOrderAmountError(false)
        setLimitBuyAmountError(false)
        setLimitSellAmountError(false)
        setLimitBuyPercentError(false)
        setLimitSellPercentError(false)

        // Reset buttons and states
        setReviewOrderClicked(false)
        setOrderProcessing(false)

    }

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
                            calcUpdatLimitPercentLabelTranslation(
                                semi_cleaned_value,
                                setLimitBuyPercentLabel,
                                'Buy Limit %',
                                setLimitBuyAmount,
                                false
                            )
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
                            calcUpdatLimitPercentLabelTranslation(
                                semi_cleaned_value,
                                setLimitSellPercentLabel,
                                'Sell Limit %',
                                setLimitSellAmount,
                                false
                            )
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
                            disabled={orderProcessing}
                            onClick={() => {
                                setOrderProcessing(true)
                                handleOrderBuySubmit()
                            }}
                        >
                            <span>Submit Order</span>
                            {orderProcessing && <CircularProgress size={24} className={classes.button_progress}/>}
                        </Button>
                        <Button
                            className="StockMiner-BigButton"
                            variant="outlined"
                            size="large"
                            disabled={orderProcessing}
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

        // @todo - If Sell Limit exists, a Buy Limit must also be given

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
     */
    const calcUpdatLimitPercentLabelTranslation = (percent, labelUpdater, labelStr, amountUpdater, currentPrice) => {
        let cleaned_percent = percent.replace('+', '')
        let cleaned_price = currentPrice || currentEstimatedPrice.replace('$', '')
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

        // Update the label string
        let new_label = ''
        if (!target_amount) {
            new_label = `${labelStr} ($0.00)`
        } else {
            new_label = `${labelStr} ($${target_amount})`
            amountUpdater('$' + target_amount)
        }
        labelUpdater(new_label)
    }

    /**
     * Send the Buy Order to the server.
     */
    const handleOrderBuySubmit = () => {
        (async () => {

            // Process order
            let uuid = currentSelectedRow.uuid
            let cost_basis = orderAmount.replace('$', '')
            let limit_buy = limitBuyAmount.replace('$', '') || 0
            let limit_sell = limitSellAmount.replace('$', '') || 0
            const order_response = await fetch(`http://localhost:2222/app/order/buy/${uuid}/${cost_basis}/${limit_buy}/${limit_sell}`)
            let order_result = await order_response.json()

            // Retrieve update row from DB
            const row_response = await fetch(`http://localhost:2222/app/get/orders/uuid/${profileActive[0]}/${uuid}/${tableTypeActive}`)
            let row_result = await row_response.json()
            if (row_result.length) {
                console.log('params: ', row_result.profile, tableIDActive, row_result[0])
                updateTableRows(profileActive[0], tableIDActive, row_result)
            }

            // Reset order processing flag and input fields
            // @todo - Eventually this should only reset if the above was sucessful
            setOrderProcessing(false)
            resetBuyInputs()
        })()
    }

    return (
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
                    if (e.target.value === 'percent') {
                        setLimitBuyAmount('')
                        setLimitSellAmount('')
                    }
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
    )
}

const mapStateToProps = (state) => {
    return {
        profileActive: state.profileActive,
        currentSelectedRow: state.currentSelectedRow,
        tableIDActive: state.tableIDActive,
        tableTypeActive: state.tableTypeActive
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedRow: (row) => dispatch(ActionTypes.setSelectedRow(row)),
        updateTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.updateTableRows(tableProfile, tableID, rows))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarOrderMenuBuy)
