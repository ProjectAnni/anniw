import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { CredentialState } from "@/state/credentials";
import useMessage from "@/hooks/useMessage";
import { getAvailableLibraryForTrack, getCoverUrlForTrack } from "@/utils/library";
import Cover from "@/components/Cover";
import { Playlist, isPlaylistItemTrack } from "@/types/common";
import styles from "./index.module.scss";

interface Props {
    playlist?: Playlist;
}

const PlaylistCover: React.FC<Props> = (props) => {
    const { playlist } = props;
    const { cover, items } = playlist || {};
    const { albumId, discId } = cover || {};
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const [_, { addMessage }] = useMessage();
    const [coverUrl, setCoverUrl] = useState("");
    useEffect(() => {
        if (!playlist || !allCredentials) {
            return;
        }
        (async () => {
            if (albumId && discId) {
                const library = await getAvailableLibraryForTrack({ albumId }, allCredentials);
                if (library) {
                    const coverUrl = getCoverUrlForTrack({ albumId, discId }, library);
                    setCoverUrl(coverUrl);
                } else {
                    addMessage("error", "播放列表封面无可用音频仓库");
                }
            } else if (items?.length) {
                const firstNonDummyTrack = items.find(isPlaylistItemTrack);
                if (!firstNonDummyTrack) {
                    return;
                }
                const library = await getAvailableLibraryForTrack(
                    firstNonDummyTrack.info,
                    allCredentials
                );
                if (library) {
                    const coverUrl = getCoverUrlForTrack(firstNonDummyTrack, library);
                    setCoverUrl(coverUrl);
                }
            } else {
                return;
            }
        })();
    }, [playlist, allCredentials, albumId, discId, items, addMessage]);
    if (!playlist) {
        return null;
    }
    return (
        <div className={styles.playlistCoverContainer}>
            {!!coverUrl && <Cover coverUrl={coverUrl} />}
        </div>
    );
};

export default PlaylistCover;
