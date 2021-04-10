import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {
    toMoneyString,
    toPercentString,
    toMoneyValue,
    calcQuantity,
    calcTotalReturn,
    calcTotalChange
} from '../../libs/value_conversions'

const TableManagerOrderDetail = (props) => {
    const {
        row,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        grid_box: {
            color: theme.palette.text.secondary,
            '& .MuiGrid-item:first-child': {
                color: theme.palette.text.disabled
            },
            '& .MuiGrid-item:last-child': {
                textAlign: 'right',
                overflow: 'hidden'
            },
            '& + *': {
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${theme.palette.secondary.main}`
            },
            '&:not(:first-child)': {
                marginTop: '16px'
            }
        }
    }))()

    const [equity, setEquity] = useState(0)
    const [cost, setCost] = useState(0)
    const [totalReturn, setTotalReturn] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [purchasePrice, setPurchasePrice] = useState(0)
    const [totalChange, setTotalChange] = useState(0)

    /**
     * Update data whenever tableData is modified.
     */
    useEffect(() => {
        let tmp_equity = toMoneyValue(row.equity)
        let tmp_cost_basis = toMoneyValue(row.cost_basis)
        let tmp_purchase_price = toMoneyValue(row.purchase_price)
        let tmp_price = toMoneyValue(row.price)
        setEquity(toMoneyString(tmp_equity))
        setCost('$' + parseFloat(tmp_cost_basis).toFixed(2))
        setTotalReturn(toMoneyString(calcTotalReturn(tmp_equity, tmp_cost_basis)))
        setQuantity(calcQuantity(tmp_equity, tmp_price))
        setPurchasePrice('$' + tmp_purchase_price)
        setTotalChange(toPercentString(calcTotalChange(tmp_purchase_price, tmp_price)))
    }, [tableData])

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={6}>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Equity
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {equity}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Cost
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {cost}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Total Return
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {totalReturn}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={6}>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Purchase Price
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {purchasePrice}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Quantity
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {quantity}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Total Change
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {totalChange}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </>
    )
}

TableManagerOrderDetail.propTypes = {
    row: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderDetail)