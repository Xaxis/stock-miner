import * as React from 'react'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const SideBarExtensionsMenu = ({tableData, currentSelectedRow}) => {

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {}
    }))()

    /**
     * Handle toggling of Extensions menu
     */
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const handleTogglePanel1 = (panel) => (event) => {
        setExpandedPanel1(!expandedPanel1)
    }

    return (
        <div>
            <Accordion
                square
                expanded={currentSelectedRow ? expandedPanel1 : false}
                onChange={handleTogglePanel1()}
                disabled={!currentSelectedRow}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>Extensions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lots of junk goes here.
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
        currentSelectedRow: state.currentSelectedRow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarExtensionsMenu)
