import React from "react";
import { Typography } from "@material-ui/core";
import "./index.scss";

const Library: React.FC = () => {
    return (
        <div className="library-page-container">
            <Typography
                variant="h4"
                className="title"
            >
                音频仓库
            </Typography>
        </div>
    );
};

export default Library;
