import * as React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function SideBarTradeMenu() {
    const [expandedPanel1, setExpandedPanel1] = React.useState(true)

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    return (
        <div>
            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel1"
                    id="sidebar-trade-panel1"
                >
                    <Typography>Buy</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            id="sidebar-trade-buy-estprice"
                            label="Estimated Price"
                            placeholder="$0.00"
                            variant="outlined"
                            defaultValue="$0.00"
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            id="sidebar-trade-buy-amount"
                            label="Amount to Buy"
                            placeholder="$0.00"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            id="sidebar-trade-buy-buylimit"
                            label="Buy Limit"
                            placeholder="$0.00"
                            helperText="Price to buy at"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            id="sidebar-trade-buy-selllimit"
                            label="Sell Limit"
                            placeholder="$0.00"
                            helperText="Price to sell at"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                        <Button
                            className="StockMinerBigButton"
                            size="large"
                        >
                            Review Order
                        </Button>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel2"
                    id="sidebar-trade-panel2"
                >
                    <Typography>Sell</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-trade-panel3"
                    id="sidebar-trade-panel3"
                >
                    <Typography>Spread Order</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    );
};
