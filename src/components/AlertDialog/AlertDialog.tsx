import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const AlertDialog = (props) => {
    const {
        isOpen,
        onDisagree,
        onAgree,
        title,
        subtitle,
        agree,
        disagree,
        children,
        ...other
    } = props;

    return (
        <>
            <Dialog
                open={isOpen}
                disableBackdropClick
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {subtitle}
                    </DialogContentText>
                    {children}
                </DialogContent>
                <DialogActions>
                    {(disagree) ?
                        <Button onClick={onDisagree} color="primary">
                            {(disagree) ? disagree : 'Disagree'}
                        </Button> : ""
                    }
                    {(agree) ?
                        <Button onClick={onAgree} color="primary">
                            {(agree) ? agree : 'Agree'}
                        </Button> : ""
                    }
                </DialogActions>
            </Dialog>
        </>
    );
}

AlertDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onDisagree: PropTypes.func.isRequired,
    onAgree: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    agree: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    disagree: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    children: PropTypes.element
}

export default AlertDialog