import React from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useRecoilValue } from "recoil";
import { SiteEnabled2FA } from "../api";

function Login() {
  const enabled2fa = useRecoilValue(SiteEnabled2FA);

  return <Grid className="grow" container alignItems="center" direction="column" justifyContent="center">
    <Grid item>
      <Typography component="h2" variant="h5">Sign In</Typography>
    </Grid>
    <form noValidate>
      <Grid item>
        <TextField variant="outlined" required label="Email" />
      </Grid>
      <Grid item>
        <TextField variant="outlined" required label="Password" />
      </Grid>
      {enabled2fa && <TextField variant="outlined" label="2FA Code" />}
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
