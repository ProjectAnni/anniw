import React from "react";
import { Grid } from "@material-ui/core";
import RegisterForm from "./RegisterForm";
import './index.scss';

const Register = () => {
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            component="div"
            className="register-form-container"
        >
            <RegisterForm />
        </Grid>
    );
};

export default Register;
