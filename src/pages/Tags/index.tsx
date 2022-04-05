import React, { useEffect } from "react";
import { RootTags, TagGraph, Tags as StateTags } from "@/state/tags";
import { useRecoilState, useRecoilValue } from "recoil";
import { Grid } from "@mui/material";
import Tag from "@/components/Tag";
import { getTagGraph, getTags } from "../TagDetail/services";

const Tags = () => {
    const rootTags = useRecoilValue(RootTags);
    const [tags, setTags] = useRecoilState(StateTags);
    const [tagGraph, setTagGraph] = useRecoilState(TagGraph);
    useEffect(() => {
        (async () => {
            if (!tagGraph || !Object.keys(tagGraph).length) {
                setTagGraph(await getTagGraph());
            }
            if (!tags?.length) {
                setTags((await getTags()).map((t) => t.name));
            }
        })();
    }, [tags, setTags, tagGraph, setTagGraph]);
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
