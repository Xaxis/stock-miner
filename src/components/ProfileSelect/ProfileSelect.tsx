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
import './ProfileSelect.scss'

const ProfileSelect = ({
                           profileActive,
                           profileList,
                           setProfileActive,
                           setProfileList
                       }) => {
    const [activeProfile, setActiveProfile] = useState('Profile 1')

    const handleProfileChange = (event) => {
        switch (event.target.value) {
            case 'add':
                break
            case 'rename':
                break
            case 'delete':
                break
            default:
                setActiveProfile(event.target.value)
                setProfileActive([{active_profile: event.target.value}])
        }
    }

    useEffect(() => {
        if (!profileActive.length) {
            
        }
    })

    return (
        <FormGroup>
            <Select
                id="sidebar-profiles-select"
                className="sm-profile-selector"
                label="Active Profile"
                value={activeProfile}
                variant="outlined"
                onChange={handleProfileChange}
                IconComponent={props => (<RecentActorsIcon {...props} />)}
            >
                {profileList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
                <Divider/>
                <MenuItem key="add" value="add">
                    <AddIcon /> New Profile
                </MenuItem>
            </Select>
        </FormGroup>
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
