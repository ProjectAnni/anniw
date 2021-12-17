import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import useQuery from "@/hooks/useQuery";
import useMessage from "@/hooks/useMessage";
import "./index.scss";

const AlbumDetail: React.FC = () => {
    const query = useQuery();
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        const albumId = query.get("id");
        if (!albumId) {
            addMessage("error", "请指定专辑 ID");
            return;
        }
    }, [query, addMessage]);
    return <Grid container>Album Detail</Grid>;
};

export default AlbumDetail;
