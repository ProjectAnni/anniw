import React from "react";
import { Typography } from "@material-ui/core";
import "./index.scss";

const Library: React.FC = () => {
    return (
        <div>
            <Typography
                variant="h4"
                className="title"
                sx={{
                    marginTop: "20px",
                }}
            >
                音频仓库
            </Typography>
        </div>
    );
};

export default Library;
