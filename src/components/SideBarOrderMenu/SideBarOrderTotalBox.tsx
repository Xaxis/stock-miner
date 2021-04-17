import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {calcQuantity} from '../../libs/value_conversions'

const SideBarOrderTotalBox = (props) => {
    const {
        symbol,
        orderAmount,
        currentPrice,
        ...other
    } = props;

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        grid_box: {
            color: theme.palette.text.secondary,
            '& .MuiGrid-item:first-child': {},
            '& .MuiGrid-item:last-child': {
                textAlign: 'right',
                overflow: 'hidden'
            },
            '& + *': {
                marginTop: '16px'
            },
            '&:not(:first-child)': {
                marginTop: '16px'
            }
        }
    }))()

    /**
     * Component states.
     */
    const [orderQuantity, setOrderQuantity] = useState(0.00)

    /**
     * Updates the Order Quantity.
     */
    useEffect(() => {
        setOrderQuantity(calcQuantity(orderAmount, currentPrice))
    }, [orderAmount, currentPrice])

    return (
        <>
            <Grid container spacing={0} className={classes.grid_box}>
                <Grid item xs={6}>
                    <Typography>
                        Estimated Price
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        {currentPrice}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={0} className={classes.grid_box}>
                <Grid item xs={6}>
                    <Typography>
                        Estimated {symbol}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        {orderQuantity}
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

SideBarOrderTotalBox.propTypes = {
    symbol: PropTypes.any.isRequired,
    orderAmount: PropTypes.any.isRequired,
    currentPrice: PropTypes.any.isRequired
}

export default SideBarOrderTotalBox
