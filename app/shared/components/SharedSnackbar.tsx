import React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export type SnackbarType = "success" | "error";


interface SharedSnackbarProps {
    open: boolean;
    type: SnackbarType;
    message?: string;
    onClose: () => void;
    duration?: number;
}

export default function SharedSnackbar(snackbarProps: SharedSnackbarProps) {
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        snackbarProps.onClose();
    };

    return (
        <Snackbar
            open={snackbarProps.open}
            autoHideDuration={snackbarProps.duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={handleClose}
                severity={snackbarProps.type}
                variant="filled"
                sx={{ width: '100%'}}
            >
                {snackbarProps.message}
            </Alert>
        </Snackbar>
    );
}
