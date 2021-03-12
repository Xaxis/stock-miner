import * as React from 'react'
import {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import ProfileSelect from '../ProfileSelect/ProfileSelect'
import fetch from 'cross-fetch'

const SideBarProfilesMenu = ({
                                 profileActive,
                                 profileList,
                                 setProfileActive,
                                 setProfileList
                             }) => {
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [newProfileName, setNewProfileName] = useState("")

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    const renameUpdateProfile = (old_profile_name, new_profile_name) => {
        (async () => {

            // Check if profile_name already exists
            let existingProfile = profileList.filter((profile) => {
                return profile.value === new_profile_name
            })

            // When the profile doesn't already exist
            if (!existingProfile.length) {

                // Set active profile to noop while updating profile
                setProfileActive(['noop'])

                // Add new profile to database
                const ren_response = await fetch(`http://localhost:2222/app/update/profiles/${old_profile_name}/${new_profile_name}`)
                const ren_result = await ren_response.json()

                // Update the state's profile list
                const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
                const pl_result = await pl_response.json()
                setProfileList(pl_result)

                // Set which profile is active in the database
                const sap_response = await fetch(`http://localhost:2222/app/add/profiles/active/${new_profile_name}`)
                const sap_result = await sap_response.json()

                // Update the active profile in state
                setProfileActive([new_profile_name])
            }
        })()
    }

    return (
        <>

            {/*<Accordion square expanded={expandedPanel1} onChange={handleChange()}>*/}
            {/*    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>*/}
            {/*        <Typography>Load Profile</Typography>*/}
            {/*    </AccordionSummary>*/}
            {/*    <AccordionDetails>*/}
            {/*        <ProfileSelect/>*/}
            {/*    </AccordionDetails>*/}
            {/*</Accordion>*/}

            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Rename Profile</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            label={`Profile Name`}
                            variant="outlined"
                            value={newProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder={profileActive.length ? profileActive[0] : ''}
                            helperText="Enter/Return saves new name."
                            onChange={(event) => {
                                setNewProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <CheckIcon
                                        color={newProfileName.length ? "action" : "secondary"}
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && newProfileName) {
                                    renameUpdateProfile(profileActive[0], newProfileName)
                                    setNewProfileName("")
                                }
                            }}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Profile Status</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion square>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Delete Profile</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ...
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </>
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
