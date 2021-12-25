import React, { useEffect } from "react";
import { RootTags, Tags as StateTags } from "@/state/tags";
import { useRecoilState, useRecoilValue } from "recoil";
import { Grid } from "@mui/material";
import Tag from "@/components/Tag";
import { getTags } from "../TagDetail/services";

const Tags = () => {
    const rootTags = useRecoilValue(RootTags);
    const [tags, setTags] = useRecoilState(StateTags);
    useEffect(() => {
        (async () => {
            if (tags === undefined || tags.length == 0) {
                setTags(await getTags());
            }
        })();
    }, [tags, setTags]);
    return (
        <Grid container>
            <Grid item>
                <h2>标签列表</h2>
            </Grid>
            <Grid item>
                {rootTags.map((t) => (
                    <Tag key={t} tag={t} />
                ))}
            </Grid>
        </Grid>
    );
};

export default Tags;
