import * as React from 'react'
import {useState, useEffect} from 'react'
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
import {toMoneyString, toPercentString, calcEquity, calcQuantity, calcTotalReturn, calcTotalChange} from '../../libs/conversions'

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
        setCost('$' + parseFloat(row._meta.cost_basis).toFixed(2))
        setTotalReturn(toMoneyString(calcTotalReturn(tmp_equity, row._meta.cost_basis)))
        setQuantity(calcQuantity(tmp_equity, row._meta.price))
        setPurchasePrice('$' + row._meta.purchase_price)
        setTotalChange(toPercentString(calcTotalChange(row._meta.purchase_price, row._meta.price)))
    }, [tableData])

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