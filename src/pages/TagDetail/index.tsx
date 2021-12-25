import React, { useEffect, useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import { TagGraph, TagIncludedBy, Tags } from "@/state/tags";
import { Grid } from "@mui/material";
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Tag from "@/components/Tag";
import { getAlbumsByTag, getTagGraph, getTags } from "./services";
import AlbumWall from "@/components/AlbumWall";

const TagDetail = () => {
    const { tag } = useParams<{ tag: string }>();
    const includes: string[] | undefined = useRecoilValue(TagGraph)[tag];
    const includedBy: string | undefined = useRecoilValue(TagIncludedBy)[tag];
    let setTags = useSetRecoilState(Tags);
    let setTagGraph = useSetRecoilState(TagGraph);
    const [albums, setAlbums] = useState<string[]>();
    useEffect(() => {
        (async () => {
            setAlbums((await getAlbumsByTag(tag)).map((a) => a.albumId));
        })();
    }, [setAlbums, tag]);
    useEffect(() => {
        (async () => {
            const tags = await getTags();
            const tagGraph = await getTagGraph();
            setTags(tags);
            setTagGraph(tagGraph);
        })();
    }, [setTags, setTagGraph, setAlbums]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <h2>{tag}</h2>
            </Grid>
            {includedBy && (
                <Grid>
                    上级 Tag：
                    <Tag tag={includedBy} />
                </Grid>
            )}
            {includes !== undefined && includes.length != 0 && (
                <Grid item xs={12}>
                    包含 Tag：
                    {includes.map((t) => {
                        return <Tag key={t} tag={t} />;
                    })}
                </Grid>
            )}
            {albums !== undefined && albums.length != 0 && (
                <Grid item xs={12}>
                    <h2>专辑列表</h2>
                    <Grid>
                        <AlbumWall albums={albums} />
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default TagDetail;
