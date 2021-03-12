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
import AddIcon from '@material-ui/icons/Add'
import FormGroup from '@material-ui/core/FormGroup'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import fetch from 'cross-fetch'

const SideBarProfilesMenu = ({
                                 profileActive,
                                 profileList,
                                 setProfileActive,
                                 setProfileList
                             }) => {
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [newProfileName, setNewProfileName] = useState("")
    const [renameProfileName, setRenameProfileName] = useState("")
    const [profileStatus, setProfileStatus] = useState("active")

    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    /**
     * Called when renaming or updating a profile name in the database. When one profile name is passed a new
     * profile is being added. When two profile names are passed a profile name is being renamed.
     */
    const updateProfileAll = (profile_name, new_profile_name) => {
        (async () => {

            // Check if profile_name already exists
            let existingProfile = profileList.filter((profile) => {
                return profile.value === (new_profile_name || profile_name)
            })

            // When the profile doesn't already exist
            if (!existingProfile.length) {

                // Set active profile to noop while updating profile
                setProfileActive(['noop'])

                // Rename new profile in database
                if (new_profile_name) {
                    const ren_response = await fetch(`http://localhost:2222/app/rename/profiles/${profile_name}/${new_profile_name}`)
                    const ren_result = await ren_response.json()

                    // Add new profile to database
                } else {
                    const apl_response = await fetch(`http://localhost:2222/app/add/profiles/${profile_name}`)
                    const apl_result = await apl_response.json()
                }

                // Update the state's profile list
                const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
                const pl_result = await pl_response.json()
                setProfileList(pl_result)

                // Set which profile is active in the database
                const sap_response = await fetch(`http://localhost:2222/app/set/profiles/active/${(new_profile_name || profile_name)}`)
                const sap_result = await sap_response.json()

                // Update the active profile in state
                setProfileActive([(new_profile_name || profile_name)])
            }
        })()
    }

    return (
        <>

            <Accordion square expanded={expandedPanel1} onChange={handleChange()}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Manage Profiles</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            label={`New Profile`}
                            variant="outlined"
                            value={newProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder=""
                            helperText="Hit Enter/Return to create."
                            onChange={(event) => {
                                setNewProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <AddIcon
                                        color={newProfileName.length ? "action" : "secondary"}
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && newProfileName) {
                                    updateProfileAll(newProfileName)
                                    setNewProfileName("")
                                }
                            }}
                        />

                        <TextField
                            label={`Rename Profile`}
                            variant="outlined"
                            value={renameProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder={profileActive.length ? profileActive[0] : ''}
                            helperText="Enter/Return saves new name."
                            onChange={(event) => {
                                setRenameProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <CheckIcon
                                        color={renameProfileName.length ? "action" : "secondary"}
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && renameProfileName) {
                                    updateProfileAll(profileActive[0], renameProfileName)
                                    setRenameProfileName("")
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Profile Status"
                            variant="outlined"
                            value={profileStatus}
                            InputLabelProps={{shrink: true}}
                            placeholder={profileActive.length ? profileActive[0] : ''}
                            helperText="Set the status of the currently open profile. Profiles that are 'Paused' stop acting on trades and recording data."
                            onChange={(event) => {
                                setProfileStatus(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <CheckIcon
                                        color={renameProfileName.length ? "action" : "secondary"}
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                        >
                            <MenuItem key="active" value="active">Active</MenuItem>
                            <MenuItem key="paused" value="paused">Paused</MenuItem>
                        </TextField>

                    </FormGroup>

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
