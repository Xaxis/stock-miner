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
    const [orderAmount, setOrderAmount] = useState("0.00")
    const [limitType, setLimitType] = useState("price")
    const [limitBuyAmount, setLimitBuyAmount] = useState("$0.00")
    const [limitSellAmount, setLimitSellAmount] = useState("$0.00")
    const [limitBuyPercent, setLimitBuyPercent] = useState("0.00%")
    const [limitSellPercent, setLimitSellPercent] = useState("0.00%")

    /**
     * Updates values in the trade/order menu when a row is selected.
     */
    useEffect(() => {
        let updater = null
        if (currentSelectedRow) {
            setCurrentSymbol('$' + currentSelectedRow.symbol)
            setCurrentEstimatedPrice('$' + currentSelectedRow.price)
            setLimitBuyAmount('$' + currentSelectedRow.price.toString())
            setLimitSellAmount('$' + currentSelectedRow.price.toString())
            updater = setInterval(() => {
                setCurrentEstimatedPrice(currentSelectedRow.price)
            }, 1000)
        } else {
            setCurrentSymbol("")
            setCurrentEstimatedPrice("$0.00")
            setLimitBuyAmount('$0.00')
            setLimitSellAmount('$0.00')
            setLimitBuyPercent('0.00%')
            setLimitSellPercent('0.00%')
        }

        return () => clearInterval(updater)
    }, [currentSelectedRow])

    const renderLimitFields = () => {
        if (limitType === 'price') {
            return (
                <>
                    <TextField
                        label="Buy Limit $"
                        placeholder={limitBuyAmount}
                        helperText="Will attempt to buy at specified price."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        label="Sell Limit $"
                        placeholder={limitSellAmount}
                        helperText="Will attempt to sell at specified price."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                    />
                </>
            )
        } else if (limitType === 'percent') {
            return (
                <>
                    <TextField
                        label="Buy Limit %"
                        placeholder={limitBuyPercent}
                        helperText="Will attempt to buy at specified % change."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        label="Sell Limit %"
                        placeholder={limitSellPercent}
                        helperText="Will attempt to sell at specified % change."
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                    />
                </>
            )
        }
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
                            placeholder="0.00"
                            variant="outlined"
                            value={orderAmount}
                            onChange={(e) => {
                                setOrderAmount(e.target.value)
                            }}
                            InputLabelProps={{shrink: true}}
                            required
                        />

                        <Divider/>

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
