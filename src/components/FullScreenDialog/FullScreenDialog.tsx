import * as React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const FullscreenDialog = (props) => {
    const {
        isOpen,
        onClose,
        title,
        children,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        modal: {
            '& .MuiDialogTitle-root': {
                padding: theme.spacing(2),
                borderBottom: `1px solid ${theme.palette.secondary.main}`
            },
            '& .MuiDialog-paperScrollPaper': {
                height: '100vh'
            },
            '& .MuiDialogContent-root': {
                padding: '0'
            }
        },
        modal_title: {
            float: 'left',
        },
        modal_close_button: {
            float: 'right'
        }
    }))()

    return (
        <Dialog
            className={classes.modal}
            fullWidth={true}
            scroll="paper"
            maxWidth="xl"
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle>
                <Typography className={classes.modal_title}>{title}</Typography>
                <IconButton
                    size="small"
                    className={classes.modal_close_button}
                    onClick={onClose}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}

FullscreenDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.element
}

export default FullscreenDialog