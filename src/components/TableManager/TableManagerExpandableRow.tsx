import * as React from 'react'
import {useState, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormGroup from "@material-ui/core/FormGroup";

const TableManagerExpandableRow = (props) => {
    const {
        rowData,
        rowMeta,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        table_row: {
            backgroundColor: theme.palette.secondary.dark,
            '&:hover': {
                backgroundColor: `${theme.palette.secondary.dark} !important`
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
        let row = getRowDataByUUID(rowData[0])
        let tmp_equity = calcEquity(row._meta.cost_basis, row._meta.purchase_price, row._meta.price).toFixed(2)
        setEquity(toMoneyString(tmp_equity))
        setCost('$' + row._meta.cost_basis)
        setTotalReturn(toMoneyString(calcTotalReturn(tmp_equity, row._meta.cost_basis)))
        setQuantity(calcQuantity(tmp_equity, row._meta.price))
        setPurchasePrice('$' + row._meta.purchase_price)
        setTotalChange(toPercentString(calcTotalChange(row._meta.purchase_price, row._meta.price)))
    }, [tableData])

    /**
     * Convert a money value to a presentable money string.
     */
    const toMoneyString = (value) => {
        if (value >= 0) {
            return '$' + value.toString()
        } else {
            return '-$' + value.toString().replace('-', '')
        }
    }

    /**
     * Convert a percent value to a presentable percent string.
     */
    const toPercentString = (value) => {
        if (value >= 0) {
            return '+' + (value.toFixed(2).toString()) + '%'
        } else {
            return (value.toFixed(2).toString()) + '%'
        }
    }

    /**
     * Calculate percentage of one value into another.
     */
    const calcPercent = (x, y) => {
        let p = parseFloat(x) / parseFloat(y)
        return (!isNaN(p) && isFinite(p) ? p : 0) * 100
    }

    /**
     * Calculate equity. The 'equity' is the total 'cost_basis' +/- the change of
     * value of a given stock.
     */
    const calcEquity = (cost_basis, purchase_price, current_price) => {
        let percent_change = (calcPercent(current_price, purchase_price) - 100)
        let amount_change = parseFloat(cost_basis) * (percent_change / 100)
        return (cost_basis + amount_change)
    }

    /**
     * Calculate quantity. The 'quantity' is the number of shares held based on the
     * current equity and the price of a given stock.
     */
    const calcQuantity = (equity_val, current_price) => {
        let q = equity_val / parseFloat(current_price)
        return (!isNaN(q) ? q : 0).toFixed(7)
    }

    /**
     * Calculate total return. The 'total return' is the difference in equity and the
     * purchase price.
     */
    const calcTotalReturn = (equity_val, cost_basis) => {
        return (equity_val - parseFloat(cost_basis)).toFixed(2)
    }

    /**
     * Calculate the total percent change.
     */
    const calcTotalChange = (purchase_price, current_price) => {
        let percent_change = calcPercent(current_price, purchase_price)
        if (percent_change === 0) {
            return 0
        } else {
            let percent_diff = percent_change - 100
            return percent_diff
        }
    }

    /**
     * Returns a reference to a row in tableData by UUID.
     */
    const getRowDataByUUID = (uuid) => {
        let result = null
        if (tableData.length) {
            tableData.forEach((profile) => {
                profile.tables.forEach((table) => {
                    let row = table.filter((row) => {
                        return row.uuid === uuid
                    })
                    if (row.length) {
                        result = row[0]
                    }
                })
            })
            return result
        } else {
            return null
        }
    }

    return (
        <TableRow className={classes.table_row}>
            <TableCell colSpan={42}>
                <Collapse in={true}>
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
                </Collapse>
            </TableCell>
        </TableRow>
    )
}

TableManagerExpandableRow.propTypes = {
    rowData: PropTypes.any.isRequired,
    rowMeta: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerExpandableRow)