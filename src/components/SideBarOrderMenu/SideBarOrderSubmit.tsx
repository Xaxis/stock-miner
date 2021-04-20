import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress'

const SideBarOrderSubmit = (props) => {
    const {
        handleSubmit,
        handleInputValidation,
        orderProcessing,
        ...other
    } = props;

    /**
     * Component style overrides.
     */
    // const classes = makeStyles(theme => ({
    // }))()

    /**
     * Component states.
     */
    const [reviewOrderClicked, setReviewOrderClicked] = useState(false)

    /**
     * Renders the correct sequence of buttons based on state of order.
     */
    const renderOrderButtons = () => {
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
                            handleSubmit()
                            setReviewOrderClicked(false)
                        }}
                    >
                        <span>Submit Order</span>
                        {orderProcessing && <CircularProgress size={24} />}
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

    return (
        <>
            {renderOrderButtons()}
        </>
    )
}

SideBarOrderSubmit.propTypes = {
    handleSubmit: PropTypes.any.isRequired,
    handleInputValidation: PropTypes.any.isRequired,
    orderProcessing: PropTypes.any.isRequired
}

export default SideBarOrderSubmit
