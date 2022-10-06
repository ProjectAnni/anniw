import React, { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { requestIdleCallback } from '@/utils/helper';

interface Props {
    title: string;
    children: React.ReactElement<any, any>;
}

const LazyTooltip: React.FC<Props> = (props) => {
    const { title, children } = props;
    const [renderOriginalToolip, setRenderOriginalToolip] = useState(false);
    useEffect(() => {
        requestIdleCallback(() => {
            setRenderOriginalToolip(true);
        })
    }, [])
    return renderOriginalToolip ? <Tooltip title={title}>{children}</Tooltip> : children;
};

export default LazyTooltip;
