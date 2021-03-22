import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
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
import MenuItem from "@material-ui/core/MenuItem";

const SideBarTradeMenu = ({currentSelectedRow}) => {
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const handleTogglePanel1 = (panel) => (event) => {
        setExpandedPanel1(!expandedPanel1)
        setExpandedPanel2(false)
    }
    const [expandedPanel2, setExpandedPanel2] = useState(false)
    const handleTogglePanel2 = (panel) => (event) => {
        setExpandedPanel2(!expandedPanel2)
        setExpandedPanel1(false)
    }

    const [currentSymbol, setCurrentSymbol] = useState("")
    const [currentEstimatedPrice, setCurrentEstimatedPrice] = useState("$0.00")
    const [orderAmount, setOrderAmount] = useState("")
    const [limitType, setLimitType] = useState("price")
    const [limitBuyAmount, setLimitBuyAmount] = useState("")
    const [limitBuyAmountPlaceholder, setLimitBuyAmountPlaceholder] = useState("$0.00")
    const [limitSellAmount, setLimitSellAmount] = useState("")
    const [limitSellAmountPlaceholder, setLimitSellAmountPlaceholder] = useState("$0.00")
    const [limitBuyPercent, setLimitBuyPercent] = useState("")
    const [limitBuyPercentPlaceholder, setLimitBuyPercentPlaceholder] = useState("0.00")
    const [limitSellPercent, setLimitSellPercent] = useState("")
    const [limitSellPercentPlaceholder, setLimitSellPercentPlaceholder] = useState("0.00")

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol(currentSelectedRow.symbol)
            setCurrentEstimatedPrice('$' + currentSelectedRow.price)
            setLimitBuyAmountPlaceholder('$' + currentSelectedRow.price.toString())
            setLimitSellAmountPlaceholder('$' + currentSelectedRow.price.toString())
            updater = setInterval(() => {
                setCurrentEstimatedPrice('$' + currentSelectedRow.price)
            }, 1000)
        } else {
            setCurrentSymbol("")
            setCurrentEstimatedPrice("$0.00")
            setLimitBuyAmount('')
            setLimitBuyAmountPlaceholder('$0.00')
            setLimitSellAmount('')
            setLimitSellAmountPlaceholder('$0.00')
            setLimitBuyPercent('')
            setLimitBuyPercentPlaceholder('0.00')
            setLimitSellPercent('')
            setLimitSellPercentPlaceholder('0.00')
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
                        helperText="Will attempt to buy at specified price."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitBuyAmount}
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
                        helperText="Will attempt to sell at specified price."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitSellAmount}
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
                        label="Buy Limit %"
                        placeholder={limitBuyPercentPlaceholder}
                        helperText="Will attempt to buy at specified % change."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitBuyPercent}
                        onChange={(e) => {
                            setLimitBuyPercent(handlePercentInput(e.target.value))
                        }}
                    />
                    <TextField
                        label="Sell Limit %"
                        placeholder={limitSellPercentPlaceholder}
                        helperText="Will attempt to sell at specified % change."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        value={limitSellPercent}
                        onChange={(e) => {
                            setLimitSellPercent(handlePercentInput(e.target.value))
                        }}
                    />
                </>
            )
        }
    }

    /**
     * Limited input sanitation on fields that accept price/amount values.
     */
    const handlePriceInput = (str_value) => {
        return '$' + str_value.replace(/[^0-9.]/g, '')
    }

    /**
     * Limited input sanitation on fields that accept percentage values.
     */
    const handlePercentInput = (str_value) => {
        return str_value.replace(/[^0-9.]/g, '')
    }

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
                            value={currentEstimatedPrice}
                            variant="outlined"
                            disabled
                            InputProps={{readOnly: false}}
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            label="Amount in USD"
                            placeholder="$0.00"
                            variant="outlined"
                            value={orderAmount}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setOrderAmount(handlePriceInput(e.target.value))
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
                            onChange={(e) => {
                                setLimitType(e.target.value)
                            }}
                        >
                            <MenuItem key="price" value="price">Price Based</MenuItem>
                            <MenuItem key="percent" value="percent">Percentage Based</MenuItem>
                        </TextField>

                        {renderLimitFields()}

                        <Button
                            className="StockMiner-BigButton"
                            size="large"
                        >
                            Review Order
                        </Button>
                        <Button
                            className="StockMiner-BigButton"
                            variant="outlined"
                            size="large"
                        >
                            Edit
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
