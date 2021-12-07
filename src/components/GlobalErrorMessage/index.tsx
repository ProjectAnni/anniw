import React from "react";
import { useRecoilState } from "recoil";
import { Snackbar, Alert } from "@material-ui/core";
import { ErrorState } from "../../state/error";

const GlobalErrorMessage: React.FC = () => {
    const [errorState, setErrorState] = useRecoilState(ErrorState);
    const { hasError, message } = errorState;
    const onClose = () => {
        setErrorState({ hasError: false, message: "" });
    };
    return (
        <Snackbar
            open={hasError}
            color="error"
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            autoHideDuration={5000}
            onClose={onClose}
        >
            <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalErrorMessage;
