import * as React from 'react'
import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Popover from '@material-ui/core/Popover'
import HelpIcon from '@material-ui/icons/Help'

const InputLabelTooltip = (props) => {
    const {
        label,
        tooltip,
        ...other
    } = props;

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        root: {
            '& .MuiSvgIcon-root': {
                float: 'right',
                marginLeft: '6px',
                width: '0.8em',
                height: '0.8em',
                marginTop: '-3px',
                cursor: 'pointer',
                color: theme.palette.secondary.light,
                '&:hover': {
                    color: theme.palette.text.primary
                }
            }
        },
        icon_default: {},
        icon_active: {
            color: `${theme.palette.primary.light} !important`
        },
        menu: {
            '& .MuiPopover-paper': {
                backgroundColor: theme.palette.secondary.dark,
                fontSize: theme.typography.pxToRem(14),
                border: `2px solid ${theme.palette.primary.light}`,
                borderRadius: '2px !important',
                maxWidth: '320px',
                padding: '12px'
            }
        }
    }))()

    /**
     * Component states.
     */
    const [anchorEl, setAnchorEl] = useState(null)

    /**
     * Handle menu open.
     */
    const handleMenuOpen = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(e.currentTarget)
    }

    /**
     * Handle menu close.
     */
    const handleMenuClose = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setAnchorEl(null)
    }

    return (
        <div className={classes.root}>
            {label}
            <HelpIcon
                className={clsx(classes.icon_default, {
                    [classes.icon_active]: anchorEl
                })}
                onClick={handleMenuOpen}
            />
            <Popover
                className={classes.menu}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <React.Fragment>
                    {tooltip}
                </React.Fragment>
            </Popover>
        </div>
    )
}

InputLabelTooltip.propTypes = {
    label: PropTypes.any.isRequired,
    tooltip: PropTypes.any.isRequired
}

export default InputLabelTooltip
