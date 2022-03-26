import React, { memo } from "react";
import { Grid, Skeleton } from "@mui/material";
import styles from "./index.module.scss";

const AlbumBasicInfo: React.FC = () => {
    return (
        <Grid container flexDirection="column" className={styles.basicInfoContainer}>
            <Skeleton variant="rectangular" width="80%" height={42} />
            <Skeleton variant="rectangular" width="40%" height={24} style={{ marginTop: "8px" }} />
            <Skeleton variant="rectangular" width="20%" height={24} style={{ marginTop: "8px" }} />
        </Grid>
    );
};

export default memo(AlbumBasicInfo);
