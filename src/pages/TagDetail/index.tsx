import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import CommonPagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import Tag from "@/components/Tag";
import AlbumWall from "@/components/AlbumWall";
import { TagGraph, TagIncludedBy, Tags } from "@/state/tags";
import { getAlbumsByTag, getTagGraph, getTags } from "./services";

const TagDetail = () => {
    const { tag } = useParams<{ tag: string }>();
    const includes: string[] | undefined = useRecoilValue(TagGraph)[tag];
    const includedBy: string | undefined = useRecoilValue(TagIncludedBy)[tag];
    const setTags = useSetRecoilState(Tags);
    const setTagGraph = useSetRecoilState(TagGraph);
    const [albums, setAlbums] = useState<string[]>();
    const [recursive, setRecursive] = useState(false);
    const [loadingAlbum, setLoadingAlbum] = useState(false);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setLoadingAlbum(true);
            try {
                const result = (await getAlbumsByTag(tag, recursive)).map((a) => a.albumId);
                setAlbums(result);
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            } finally {
                setLoadingAlbum(false);
            }
        })();
    }, [setAlbums, tag, recursive, setLoadingAlbum, addMessage]);
    useEffect(() => {
        (async () => {
            const tags = await getTags();
            const tagGraph = await getTagGraph();
            setTags(tags);
            setTagGraph(tagGraph);
        })();
    }, [setTags, setTagGraph, setAlbums]);
    const onRecursiveChange = (_: unknown, checked: boolean) => {
        setRecursive(checked);
    };

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
            <Grid item xs={12}>
                <h2>专辑列表</h2>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={recursive} onChange={onRecursiveChange} />}
                        label="显示子 Tag 专辑"
                    />
                </FormGroup>
                <Grid>
                    {loadingAlbum ? (
                        <Loading />
                    ) : (
                        !!albums?.length && (
                            <CommonPagination<string> items={albums}>
                                {({ items: albumIds }) => <AlbumWall albums={albumIds} />}
                            </CommonPagination>
                        )
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TagDetail;
