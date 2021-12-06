import React from "react";
import { useRecoilState } from "recoil";
import { Snackbar } from "@material-ui/core";
import { ErrorState } from "../../state/error";

const GlobalErrorMessage: React.FC = () => {
    const [errorState, setErrorState] = useRecoilState(ErrorState);
    const { hasError, message } = errorState;
    return (
        <Snackbar
            open={hasError}
            message={message}
            autoHideDuration={5000}
            onClose={() => {
                setErrorState({ hasError: false, message: "" });
            }}
        ></Snackbar>
    );
};

export default GlobalErrorMessage;
