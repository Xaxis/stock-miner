import * as React from 'react'
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import FormGroup from '@material-ui/core/FormGroup'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import AddIcon from '@material-ui/icons/Add'
import AlertDialog from '../AlertDialog/AlertDialog'
import TextField from '@material-ui/core/TextField'
import fetch from 'cross-fetch'
import './ProfileSelect.scss'

const ProfileSelect = (props) => {
    const {
        profileActive,
        profileList,
        setProfileActive,
        setProfileList,
        ...other
    } = props;
    const [defaultOptions, setDefaultOptions] = useState([{
        name: 'No Profile',
        status: 'active'
    }])
    const [defaultActiveProfile, setDefaultActiveProfile] = useState('No Profile')
    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [newProfileName, setNewProfileName] = useState("")

    /**
     * Handles creating a new profile and updating which profile is active.
     */
    const updateProfileAll = (profile_name) => {
        (async () => {

            // Check if profile_name already exists
            let existingProfile = profileList.filter((profile) => {
                return profile.value === profile_name
            })

            // Set active profile to noop while updating profile
            setProfileActive(['noop'])

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
            const sap_response = await fetch(`http://localhost:2222/app/set/profiles/active/${profile_name}`)
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
     */
    useEffect(() => {
        if (!profileList.length) {
            const timer = setTimeout(() => {
                if (!profileList.length) {
                    setAlertDialogOpen(true)
                }
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setAlertDialogOpen(false)
        }
    }, [profileList])

    return (
        <>
            <AlertDialog
                isOpen={alertDialogOpen}
                onDisagree={() => {
                    setAlertDialogOpen(false)
                }}
                onAgree={handleCreateNewProfile}
                title='Create a profile'
                subtitle={"Stock Miner requires a profile. A profile is the hierarchy underwhich multiple tables of" +
                " trades are organized. You can have an unlimited number of profiles though only one can be viewed at" +
                " a time."}
                agree={false}
                disagree={false}
            >
                <FormGroup>
                    <TextField
                        label={`Profile Name`}
                        variant="outlined"
                        value={newProfileName}
                        InputLabelProps={{shrink: true}}
                        placeholder=""
                        helperText="Enter/Return to create."
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
                                setAlertDialogOpen(false)
                            }
                        }}
                    />
                </FormGroup>
            </AlertDialog>

            <FormGroup>
                <Select
                    className="sm-profile-selector"
                    value={profileList.length ? (profileActive.length ? profileActive[0] : 'noop') : defaultActiveProfile}
                    variant="outlined"
                    onChange={(event) => {
                        updateProfileAll(event.target.value)
                    }}
                    IconComponent={props => (<RecentActorsIcon {...props} />)}
                >
                    {
                        profileList.length
                            ?
                            profileList.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))
                            :
                            defaultOptions.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                    }
                    <MenuItem key="noop" value="noop" style={{display: "none"}}/>E
                </Select>
            </FormGroup>
        </>
    )
}

ProfileSelect.propTypes = {
    type: PropTypes.any
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
