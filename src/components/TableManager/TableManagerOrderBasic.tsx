import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {getRowDataByUUID} from '../../libs/state_modifiers'

const TableManagerOrderBasic = (props) => {
    const {
        rowData,
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

    const [symbol, setSymbol] = useState(0)
    const [name, setName] = useState(0)
    const [status, setStatus] = useState(0)
    const [limitBuy, setLimitBuy] = useState(0)
    const [limitSell, setLimitSell] = useState(0)
    const [maxLoss, setMaxLoss] = useState(0)

    /**
     * Update data whenever tableData is modified.
     */
    useEffect(() => {
        let row = getRowDataByUUID(rowData[0], tableData)
        setSymbol(row.symbol)
        setName(row.name)
        setStatus(row.status)
        setLimitBuy(row.limit_buy)
        setLimitSell(row.limit_sell)
        setMaxLoss(row.loss_perc)
    }, [tableData])

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={4}>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Symbol
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {symbol}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Limit Buy
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {limitBuy}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={4}>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {name}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Limit Sell
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {limitSell}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={4}>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Status
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {status}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} className={classes.grid_box}>
                        <Grid item xs={6}>
                            <Typography>
                                Maximum Loss
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {maxLoss}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </>
    )
}

TableManagerOrderBasic.propTypes = {
    rowData: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderBasic)