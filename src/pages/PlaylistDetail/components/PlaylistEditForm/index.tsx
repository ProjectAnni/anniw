import { Dialog } from "@mui/material";
import React from "react";

interface Props {
    open: boolean;
}

const PlaylistEditForm: React.FC<Props> = (props) => {
    const { open } = props;
    return <Dialog open={open}></Dialog>;
};

export default PlaylistEditForm;
