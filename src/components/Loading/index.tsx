import React from "react";
import { CircularProgress } from "@mui/material";
import "./index.scss";

const Loading = () => {
    return (
        <div className="loading-container">
            <CircularProgress />
        </div>
    );
};

export default Loading;
