import * as React from 'react'
import {useState} from "react"
import PropTypes from "prop-types"
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const AlertDialog = (props) => {
    const {
        isOpen,
        onClose,
        onSubmit,
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
                onClose={onClose}
                onSubmit={onSubmit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {subtitle}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        {(disagree) ? disagree : 'Disagree'}
                    </Button>
                    <Button onClick={onSubmit} color="primary" autoFocus>
                        {(agree) ? agree : 'Agree'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

AlertDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    agree: PropTypes.string,
    disagree: PropTypes.string,
    children: PropTypes.element
}

export default AlertDialog