import React from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

function Login() {
  return <Grid className="grow" container alignItems="center" direction="column" justify="center">
    <Grid item>
      <Typography component="h2" variant="h5">Sign In</Typography>
    </Grid>
    <form noValidate>
      <Grid item>
        <TextField variant="outlined" required label="Email" />
      </Grid>
      <TextField variant="outlined" required label="Password " />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
      >
        Sign In
      </Button>
    </form>
  </Grid>;
}

export default Login;
