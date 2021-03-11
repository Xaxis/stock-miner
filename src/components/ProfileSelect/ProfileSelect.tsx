import * as React from 'react'
import {useState, useEffect} from "react"
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import FormGroup from '@material-ui/core/FormGroup'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import AddIcon from '@material-ui/icons/Add'
import AlertDialog from '../AlertDialog/AlertDialog'
import './ProfileSelect.scss'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import fetch from "cross-fetch";

const ProfileSelect = ({
                           profileActive,
                           profileList,
                           setProfileActive,
                           setProfileList
                       }) => {
    const [defaultOptions, setDefaultOptions] = useState([{
        label: 'No Profile',
        value: 'No Profile'
    }])
    const [defaultActiveProfile, setDefaultActiveProfile] = useState('No Profile')
    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [newProfileName, setNewProfileName] = useState(false)

    /**
     * When a different profile OR action on a profile is taken, handle it.
     */
    const handleProfileChange = (event) => {
        switch (event.target.value) {
            case 'add':
                break
            case 'rename':
                break
            case 'delete':
                break
            default:
                updateProfileAll(event.target.value)
        }
    }

    /**
     * Handles creating a new profile and updating which profile is active.
     */
    const updateProfileAll = (profile_name) => {
        (async () => {

            // Check if profile_name already exists
            let existingProfile = profileList.filter((profile) => {
                return profile.value === profile_name
            })

            // When the profile doesn't already exist
            if (!existingProfile.length) {

                // Add new profile to database
                const apl_response = await fetch(`http://localhost:2222/app/add/profiles/${profile_name}`)
                const apl_result = await apl_response.json()

                // Update the state's profile list
                const pl_response = await fetch(`http://localhost:2222/app/get/profiles/list`)
                const pl_result = await pl_response.json()
                setProfileList(pl_result)
            }

            // Set which profile is active in the database
            const sap_response = await fetch(`http://localhost:2222/app/add/profiles/active/${profile_name}`)
            const sap_result = await sap_response.json()

            // Update the active profile in state
            setProfileActive([profile_name])
        })()
    }

    /**
     * Handles adding new active profile and profile to the database as well as retrieving
     * the updated profile list.
     */
    const handleCreateNewProfile = () => {
        if (newProfileName) {

            // Run all the profile update tasks
            updateProfileAll(newProfileName)

            // Close the create profile dialog
            setAlertDialogOpen(false)
        }
    }

    /**
     * This triggers the AlertDialogue 'Create a profile' modal if no profiles exist.
     * @todo - Refactor so that this modal doesn't flash if profiles already exist.
     */
    // useEffect(() => {
    //     if (!profileList.length) {
    //         setAlertDialogOpen(true)
    //     } else {
    //         setAlertDialogOpen(false)
    //     }
    // })

    return (
        <>
            <AlertDialog
                isOpen={alertDialogOpen}
                onClose={() => {
                    setAlertDialogOpen(false)
                }}
                onSubmit={handleCreateNewProfile}
                title='Create a profile'
                subtitle={"Stock Miner requires a profile. A profile is the hierarchy underwhich multiple tables of" +
                " trades are organized. You can have an unlimited number of profiles though only one can be viewed at" +
                " a time."}
                agree={'Create Profile'}
                disagree={false}
            >
                <FormGroup>
                    <TextField
                        label="Profile Name"
                        variant="outlined"
                        onChange={(event) => {
                            setNewProfileName(event.target.value)
                        }}
                    />
                </FormGroup>
            </AlertDialog>

            <FormGroup>
                <Select
                    id="sidebar-profiles-select"
                    className="sm-profile-selector"
                    value={profileList.length ? (profileActive.length ? profileActive[0] : 'Active Profile') : defaultActiveProfile}
                    // defaultValue={profileList.length ? profileActive.active_profile : defaultActiveProfile}
                    variant="outlined"
                    onChange={handleProfileChange}
                    IconComponent={props => (<RecentActorsIcon {...props} />)}
                >
                    {
                        profileList.length
                            ?
                            profileList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                            :
                            defaultOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                    }
                    <Divider/>
                    <MenuItem
                        key="add"
                        value="add"
                        onClick={() => {
                            setAlertDialogOpen(true)
                        }}
                    >
                        <AddIcon/> New Profile
                    </MenuItem>
                </Select>
            </FormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSelect)
