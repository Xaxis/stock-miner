import * as React from 'react'
import {useState, useEffect} from "react"
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FormGroup from "@material-ui/core/FormGroup"
import TextField from "@material-ui/core/TextField"
import MenuItem from "@material-ui/core/MenuItem"

const SideBarProfilesMenu = ({
                                 profileActive,
                                 profileList,
                                 setProfileActive,
                                 setProfileList
                             }) => {
    const [expandedPanel1, setExpandedPanel1] = useState(true)

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    return (
        <div>
            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="sidebar-profiles-panel1"
                    id="sidebar-profiles-panel1"
                >
                    <Typography>Profiles</Typography>
                </AccordionSummary>
                <AccordionDetails>

                </AccordionDetails>
            </Accordion>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        profileActive: state.profileActive,
        profileList: state.profileList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProfileActive: (active) => dispatch(ActionTypes.setProfileActive(active)),
        setProfileList: (list) => dispatch(ActionTypes.setProfileList(list)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarProfilesMenu)
