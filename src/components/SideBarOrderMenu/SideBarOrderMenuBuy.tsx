import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import SideBarOrderLimit from './SideBarOrderLimit'
import SideBarOrderLossPrevent from './SideBarOrderLossPrevent'
import SideBarOrderTotalBox from './SideBarOrderTotalBox'
import SideBarOrderSubmit from './SideBarOrderSubmit'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import {toMoneyValue} from '../../libs/value_conversions'

const SideBarOrderMenuBuy = (props) => {
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
    const classes = makeStyles(theme => ({
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
    const [limitBuyAmount, setLimitBuyAmount] = useState("")
    const [limitSellAmount, setLimitSellAmount] = useState("")
    const [lossPreventPercent, setLossPreventPercent] = useState("")

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
     * Send the Buy Order to the server.
     */
    const handleOrderBuySubmit = () => {
        (async () => {

            // Process order inputs and order
            let uuid = currentSelectedRow.uuid
            let cost_basis = toMoneyValue(orderAmount)
            let buy_price = toMoneyValue(currentEstimatedPrice)
            let limit_buy = limitBuyAmount || 0
            let limit_sell = limitSellAmount || 0
            let loss_perc = lossPreventPercent || 0
            const order_response = await fetch(`http://localhost:2222/app/order/buy/${uuid}/${cost_basis}/${buy_price}/${limit_buy}/${limit_sell}/${loss_perc}`)
            let order_result = await order_response.json()

            // Retrieve update row from DB
            const row_response = await fetch(`http://localhost:2222/app/get/orders/uuid/${profileActive[0]}/${uuid}`)
            let row_result = await row_response.json()
            if (row_result.length) {
                updateTableRows(profileActive[0], tableIDActive, row_result)
            }

            // Reset order processing flag and input fields
            setOrderProcessing(false)
            resetBuyInputs()
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
                variant="both"
                currentPrice={currentEstimatedPrice}
                getLimitBuyAmount={(amount) => {
                    setLimitBuyAmount(amount)
                }}
                getLimitSellAmount={(amount) => {
                    setLimitSellAmount(amount)
                }}
            />

            <SideBarOrderLossPrevent
                disabled={!currentSelectedRow}
                currentPrice={currentEstimatedPrice}
                getLossPreventPercent={(percent) => {
                    setLossPreventPercent(percent)
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
                        handleOrderBuySubmit()
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

export default connect(mapStateToProps, mapDispatchToProps)(SideBarOrderMenuBuy)
