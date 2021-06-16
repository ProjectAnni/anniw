import Typography from "@material-ui/core/Typography/Typography";
import React from "react";

import styles from "./NotFound.module.scss";

function NotFound() {
  return <div className={styles.notFound}>
    <Typography variant="h2">
      404 - Not Found
    </Typography>
  </div>;
}

export default NotFound;
