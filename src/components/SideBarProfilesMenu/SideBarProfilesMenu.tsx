import * as React from 'react'
import {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import AlertDialog from '../AlertDialog/AlertDialog'

const SideBarProfilesMenu = ({
                                 profileActive,
                                 profileList,
                                 tableIDActive,
                                 tableTypeActive,
                                 setProfileActive,
                                 setProfileList,
                                 updateTableRows,
                                 deleteProfileTables
                             }) => {
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [newProfileName, setNewProfileName] = useState("")
    const [newProfileNameError, setNewProfileNameError] = useState(false)
    const [newProfileNameHelperText, setNewProfileNameHelperText] = useState({
        default: "Enter/Return creates a new profile.",
        error: "Profile name already exists or is invalid!"
    })
    const [renameProfileName, setRenameProfileName] = useState("")
    const [renameProfileError, setRenameProfileError] = useState(false)
    const [renameProfileHelperText, setRenameProfileHelperText] = useState({
        default: "Enter/Return saves and renames profile.",
        error: "Profile name already exists or is invalid!"
    })
    const [deleteProfileError, setDeleteProfileError] = useState(false)
    const [deleteProfileHelperText, setDeleteProfileHelperText] = useState({
        default: "Type the name of the current profile to delete and hit Enter/Return to continue.",
        error: "You can only delete the currently loaded profile!"
    })
    const [profileStatus, setProfileStatus] = useState("active")
    const [deleteProfileName, setDeleteProfileName] = useState("")
    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false)

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {}
    }))()

    /**
     * Toggle handler sets state on menu's accordion panel.
     */
    const handleAccordionPanelExpand = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    /**
     * Called when renaming or updating a profile name in the database.
     */
    const handleCreateOrRenameProfile = (profile_name, new_profile_name) => {
        (async () => {

            // Set active profile to noop while updating profile
            setProfileActive(['noop'])

            // Rename new profile in database
            if (new_profile_name) {
                const ren_response = await fetch(`http://localhost:2222/app/rename/profiles/${profile_name}/${new_profile_name}`)
                const ren_result = await ren_response.json()

            }

            // Add new profile to database
            else {
                const apl_response = await fetch(`http://localhost:2222/app/add/profiles/${profile_name}`)
                const apl_result = await apl_response.json()
            }

            // Update the profile list
            const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
            const pl_result = await pl_response.json()
            setProfileList(pl_result)

            // Update the active profile state
            setProfileActive([(new_profile_name || profile_name)])
        })()
    }

    /**
     * Updates the 'status' field in the database and resyncs the profile list.
     */
    const handleProfileStatusChange = (status) => {
        (async () => {
            let activeProfileName = profileActive[0]

            // Update the status of the current profile
            const stat_response = await fetch(`http://localhost:2222/app/set/profiles/status/${activeProfileName}/${status}`)
            const stat_result = await stat_response.json()

            // Update the profile list
            const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
            const pl_result = await pl_response.json()
            setProfileList(pl_result)

            // Reload all rows with updated statuses upon profile status change.
            const rows_response = await fetch(`http://localhost:2222/app/get/orders/list/${activeProfileName}/${tableTypeActive}`)
            let rows_result = await rows_response.json()
            if (rows_result.length) updateTableRows(activeProfileName, tableIDActive, rows_result)
        })()
    }

    /**
     * Sends delete profile request to the server, deletes the profile, then attempts to load the most recently
     * used profile, if no more profiles exist prompts user to create a new profile.
     */
    const handleDeleteProfile = (profile_name) => {
        (async () => {

            // Set active profile to noop while updating profile
            setProfileActive(['noop'])

            // Delete profile data from state
            deleteProfileTables(profile_name)

            // Delete the profile in the database. When a profile is deleted the active profile is automatically
            // set to 'noop' in the Config table to keep this field in sync with its deleted counterpart
            // before it is again updated below.
            const del_response = await fetch(`http://localhost:2222/app/delete/profiles/${profile_name}`)
            const del_result = await del_response.json()

            // Proceed when delete was successful
            if (del_result.success) {

                // Get the new profile list
                const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
                const pl_result = await pl_response.json()
                setProfileList(pl_result)

                // Set which profile is active in the database
                let new_active_profile = pl_result.length ? pl_result[0].name : 'noop'
                const sap_response = await fetch(`http://localhost:2222/app/set/profiles/active/${new_active_profile}`)
                const sap_result = await sap_response.json()
                setProfileActive([new_active_profile])

                // Close dialog and empty input field
                setDeleteAlertDialogOpen(false)
                setDeleteProfileName("")
            }
        })()
    }


    /**
     * Updates the Profile Status flag upon change to the profile list or profile active states.
     */
    useEffect(() => {
        if (profileList.length && profileActive.length) {
            let activeProfileKey = profileActive[0]
            let activeProfile = profileList.filter((profile) => {
                return profile.name === activeProfileKey
            })
            if (activeProfile.length) {
                setProfileStatus(activeProfile[0].status)
            }
        }
    }, [profileActive, profileList])

    return (
        <>

            <Accordion square expanded={expandedPanel1} onChange={handleAccordionPanelExpand()}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Manage Profiles</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            error={newProfileNameError}
                            label={`New Profile`}
                            variant="outlined"
                            value={newProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder=""
                            helperText={newProfileNameError ? newProfileNameHelperText.error : newProfileNameHelperText.default}
                            onChange={(event) => {
                                setNewProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <AddIcon
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && newProfileName) {
                                    let plArr = profileList.map((profile) => profile.name)
                                    if (plArr.indexOf(newProfileName) !== -1) {
                                        setNewProfileNameError(true)
                                    } else {
                                        handleCreateOrRenameProfile(newProfileName)
                                        setNewProfileName("")
                                    }
                                } else {
                                    setNewProfileNameError(false)
                                }
                            }}
                        />

                        <TextField
                            error={renameProfileError}
                            label={`Rename Profile`}
                            variant="outlined"
                            value={renameProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder={profileActive.length ? profileActive[0] : ''}
                            helperText={renameProfileError ? renameProfileHelperText.error : renameProfileHelperText.default}
                            onChange={(event) => {
                                setRenameProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <CheckIcon
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && renameProfileName) {
                                    let plArr = profileList.map((profile) => profile.name)
                                    if (plArr.indexOf(renameProfileName) !== -1) {
                                        setRenameProfileError(true)
                                    } else {
                                        handleCreateOrRenameProfile(profileActive[0], renameProfileName)
                                        setRenameProfileName("")
                                    }
                                } else {
                                    setRenameProfileError(false)
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
                            helperText="Set the status of the currently open profile."
                            onChange={(event) => {
                                handleProfileStatusChange(event.target.value)
                            }}
                        >
                            <MenuItem key="active" value="active">Active</MenuItem>
                            <MenuItem key="paused" value="paused">Paused</MenuItem>
                        </TextField>

                        <TextField
                            error={deleteProfileError}
                            label={`Delete Profile`}
                            variant="outlined"
                            value={deleteProfileName}
                            InputLabelProps={{shrink: true}}
                            placeholder={profileActive.length ? profileActive[0] : ''}
                            helperText={deleteProfileError ? deleteProfileHelperText.error : deleteProfileHelperText.default}
                            onChange={(event) => {
                                setDeleteProfileName(event.target.value)
                            }}
                            InputProps={{
                                readOnly: false,
                                endAdornment: (
                                    <DeleteIcon
                                        style={{marginRight: '-8px'}}
                                    />
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && deleteProfileName) {
                                    if (deleteProfileName !== profileActive[0]) {
                                        setDeleteProfileError(true)
                                    } else {
                                        setDeleteAlertDialogOpen(true)
                                    }
                                } else {
                                    setDeleteProfileError(false)
                                }
                            }}
                        />

                        <AlertDialog
                            isOpen={deleteAlertDialogOpen}
                            onDisagree={function () {
                                setDeleteAlertDialogOpen(false)
                            }}
                            onAgree={function () {
                                handleDeleteProfile(deleteProfileName)
                            }}
                            title={`Delete profile: ${deleteProfileName}?`}
                            subtitle={"Waning! You cannot undelete a profile! All tables, simulated trades, and queued orders" +
                            " along with all of their associated records will be erased. Please think long and hard about erasing" +
                            " this profile."}
                            agree={"Delete"}
                            disagree={"Nevermind"}
                        >
                        </AlertDialog>

                    </FormGroup>

                </AccordionDetails>
            </Accordion>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        profileActive: state.profileActive,
        profileList: state.profileList,
        tableIDActive: state.tableIDActive,
        tableTypeActive: state.tableTypeActive
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProfileActive: (active) => dispatch(ActionTypes.setProfileActive(active)),
        setProfileList: (list) => dispatch(ActionTypes.setProfileList(list)),
        updateTableRows: (tableProfile, tableID, rows) => dispatch(ActionTypes.updateTableRows(tableProfile, tableID, rows)),
        deleteProfileTables: (tableProfile, tableID, rows) => dispatch(ActionTypes.deleteProfileTables(tableProfile))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarProfilesMenu)
