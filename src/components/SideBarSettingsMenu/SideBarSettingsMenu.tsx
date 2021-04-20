import * as React from 'react'
import {useState, useEffect} from 'react'
import fetch from 'cross-fetch'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import InputLabelTooltip from '../InputLabelTooltip/InputLabelTooltip'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import VisibilityOnIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function SideBarSettingsMenu() {

    /**
     * Handle toggling the Buy accordion.
     */
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const handleTogglePanel1 = (panel) => (event) => {
        setExpandedPanel1(!expandedPanel1)
    }

    /**
     * Username states.
     */
    const [username, setUsername] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const [usernameHelperText, setUsernameHelperText] = useState({
        default: "Your Robinhood username.",
        error: "Username provided is invalid!"
    })

    /**
     * Password states.
     */
    const [password, setPassword] = useState("")
    const [passwordShow, setPasswordShow] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordHelperText, setPasswordHelperText] = useState({
        default: "Your Robinhood password.",
        error: "Password provided is invalid!"
    })

    /**
     * MFA states
     * @todo - In case we ever implement Multi Factor Authorization tokens.
     */
    // const [mfa, setMfa] = useState("")
    // const [mfaShow, setMfaShow] = useState(false)
    // const [mfaError, setMfaError] = useState(false)
    // const [mfaHelperText, setMfaHelperText] = useState({
    //     default: "Your Robinhood MFA token (not required).",
    //     error: "Password provided is invalid!"
    // })

    /**
     * Button states.
     */
    const [submitProcessing, setSubmitProcessing] = useState(false)

    /**
     * Attempt to update credential fields with any existing values.
     */
    useEffect(() => {
        getConfig()
    }, [])

    /**
     * Retrieves config values from the server.
     */
    const getConfig = () => {
        (async () => {
            const config_response = await fetch(`http://localhost:2222/app/get/config`)
            let config_result = await config_response.json()
            if (config_result.hasOwnProperty('rh_username')) {
                setUsername(config_result.rh_username)
                setPassword(config_result.rh_password)
            }
        })()
    }

    /**
     * Handle updating settings.
     */
    const handleSubmit = () => {
        (async () => {
            const credentials_response = await fetch(encodeURI(`http://localhost:2222/app/set/config/credentials/${username}/${password}`))
            let credentials_result = await credentials_response.json()

            // Reset order processing flag and input fields
            setSubmitProcessing(false)
        })()
    }

    return (
        <div>
            <Accordion
                square
                expanded={expandedPanel1}
                onChange={handleTogglePanel1()}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>
                        Robinhood Settings
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            InputLabelProps={{style: {pointerEvents: "auto"}, shrink: true}}
                            label={
                                <InputLabelTooltip
                                    label="Username"
                                    tooltip={
                                        <Typography>
                                            The username you use to access your Robinhood account, typically
                                            an e-mail address.
                                        </Typography>
                                    }
                                />
                            }
                            variant="outlined"
                            value={username}
                            helperText={usernameError ? usernameHelperText.error : usernameHelperText.default}
                            error={usernameError}
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                        />

                        <TextField
                            InputLabelProps={{style: {pointerEvents: "auto"}, shrink: true}}
                            label={
                                <InputLabelTooltip
                                    label="Password"
                                    tooltip={
                                        <Typography>
                                            The password you use to access your Robinhood account.
                                        </Typography>
                                    }
                                />
                            }
                            type={passwordShow ? 'text' : 'password'}
                            variant="outlined"
                            value={password}
                            helperText={passwordError ? passwordHelperText.error : passwordHelperText.default}
                            error={passwordError}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setPasswordShow(!passwordShow)
                                            }}
                                            edge="end"
                                        >
                                            {passwordShow ? <VisibilityOnIcon/> : <VisibilityOffIcon/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            className="StockMiner-BigButton"
                            size="large"
                            disabled={submitProcessing}
                            onClick={() => {
                                setSubmitProcessing(true)
                                handleSubmit()
                            }}
                        >
                            <span>Update Settings</span>
                            {submitProcessing && <CircularProgress size={24} />}
                        </Button>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}
