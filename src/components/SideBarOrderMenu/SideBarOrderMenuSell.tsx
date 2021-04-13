import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import SideBarOrderTotalBox from './SideBarOrderTotalBox'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import fetch from 'cross-fetch'
import {calcQuantity, toMoneyValue, toPercentValue} from '../../libs/value_conversions'
import SideBarOrderSubmit from "./SideBarOrderSubmit";
import SideBarOrderLimit from "./SideBarOrderLimit";

const SideBarOrderMenuSell = (props) => {
    const {
        profileActive,
        tableIDActive,
        currentSelectedRow,
        setSelectedRow,
        updateTableRows,
        ...other
    } = props;

    /**
     * Component style overrides.
     */
    // const classes = makeStyles(theme => ({}))()

    /**
     * Order field values.
     */
    const [currentSymbol, setCurrentSymbol] = useState("")
    const [currentEstimatedPrice, setCurrentEstimatedPrice] = useState("$0.00")
    const [orderAmount, setOrderAmount] = useState("")
    const [limitBuyAmount, setLimitBuyAmount] = useState("")
    const [limitSellAmount, setLimitSellAmount] = useState("")

    /**
     * Input validation, error handling flags and condition state values.
     */
    const [orderProcessing, setOrderProcessing] = useState(false)
    const [orderAmountError, setOrderAmountError] = useState(false)
    const [orderAmountHelperText, setOrderAmountHelperText] = useState({
        default: "",
        error: "Please provide an appropriate value."
    })

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
            setCurrentEstimatedPrice('$' + toMoneyValue(currentSelectedRow.price))
            updater = setInterval(() => {
                let current_price = toMoneyValue(currentSelectedRow.price)
                setCurrentEstimatedPrice('$' + current_price)
            }, 1000)
        } else {
            resetBuyInputs()
        }
        return () => clearInterval(updater)
    }, [currentSelectedRow])

    /**
     * Reset the inputs when the table ID active changes.
     */
    useEffect(() => {
        resetBuyInputs()
    }, [tableIDActive])

    /**
     * Resets the Buy Inputs with their initial values.
     */
    const resetBuyInputs = () => {

        // Reset input values
        setCurrentSymbol("")
        setOrderAmount("")
        setCurrentEstimatedPrice("$0.00")

        // Reset error flags
        setOrderAmountError(false)

        // Reset buttons and states
        setOrderProcessing(false)
    }

    /**
     * Send the Sell Order to the server.
     */
    const handleOrderSellSubmit = () => {
        (async () => {
            let uuid = currentSelectedRow.uuid
            let sale_basis = toMoneyValue(orderAmount)
            let sell_price = toMoneyValue(currentEstimatedPrice)
            let limit_sell = limitSellAmount || 0

            const order_response = await fetch(`http://localhost:2222/app/order/sell/${uuid}/${sale_basis}/${sell_price}/${limit_sell}`)
            let order_result = await order_response.json()

            // Retrieve update row from DB
            const row_response = await fetch(`http://localhost:2222/app/get/orders/uuid/${profileActive[0]}/${uuid}`)
            let row_result = await row_response.json()
            if (row_result.length) {
                updateTableRows(profileActive[0], tableIDActive, row_result)
            }

            // Reset order processing flag and input fields
            setOrderProcessing(false)
        })()
    }

    return (
        <FormGroup>
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
                        let cleaned_amount = toMoneyValue(e.target.value)
                        setOrderAmount('$' + cleaned_amount)
                    } else {
                        setOrderAmount('')
                    }
                }}
                InputLabelProps={{shrink: true}}
                required
            />

            <SideBarOrderLimit
                disabled={!currentSelectedRow}
                variant="sell"
                currentPrice={currentEstimatedPrice}
                getLimitBuyAmount={(amount) => {
                    setLimitBuyAmount(amount)
                }}
                getLimitSellAmount={(amount) => {
                    setLimitSellAmount(amount)
                }}
            />

            <SideBarOrderTotalBox
                symbol={currentSymbol}
                orderAmount={orderAmount}
                currentPrice={currentEstimatedPrice}
            />

            {currentSelectedRow
                ?
                <SideBarOrderSubmit
                    handleSubmit={() => {
                        setOrderProcessing(true)
                        handleOrderSellSubmit()
                    }}
                    handleInputValidation={() => {

                        // Check if any required fields are left empty
                        if (!orderAmount) {
                            setOrderAmountError(true)
                            return false
                        } else {
                            setOrderAmountError(false)
                        }
                        return true
                    }}
                    orderProcessing={orderProcessing}
                /> : ''
            }
        </FormGroup>
    )
}

const mapStateToProps = (state) => {
    return {
        profileActive: state.profileActive,
        currentSelectedRow: state.currentSelectedRow,
        tableIDActive: state.tableIDActive
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedRow: (row) => dispatch(ActionTypes.setSelectedRow(row)),
        updateTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.updateTableRows(tableProfile, tableID, rows))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarOrderMenuSell)
