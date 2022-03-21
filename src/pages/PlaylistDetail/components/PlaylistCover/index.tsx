import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { CredentialState } from "@/state/credentials";
import useMessage from "@/hooks/useMessage";
import { getAvailableLibraryForTrack } from "@/utils/library";
import Cover from "@/components/Cover";
import { Playlist, PlaylistSongNormal } from "@/types/common";
import styles from "./index.module.scss";

interface Props {
    playlist?: Playlist;
}

const PlaylistCover: React.FC<Props> = (props) => {
    const { playlist } = props;
    const { cover, songs } = playlist || {};
    const { albumId, discId } = cover || {};
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const [_, { addMessage }] = useMessage();
    const [coverUrl, setCoverUrl] = useState("");
    useEffect(() => {
        if (!playlist || !allCredentials) {
            return;
        }
        (async () => {
            if (albumId) {
                const library = await getAvailableLibraryForTrack({ albumId }, allCredentials);
                if (library) {
                    const coverUrl = discId
                        ? `${library.url}/${albumId}/${discId}/cover`
                        : `${library.url}/${albumId}/cover`;
                    setCoverUrl(coverUrl);
                } else {
                    addMessage("error", "播放列表封面无可用音频仓库");
                }
            } else if (songs?.length) {
                const firstNonDummyTrack = songs.find(
                    (track) => track.type === "normal"
                ) as PlaylistSongNormal;
                const library = await getAvailableLibraryForTrack(
                    firstNonDummyTrack,
                    allCredentials
                );
                if (library) {
                    const coverUrl = `${library.url}/${firstNonDummyTrack.albumId}/${firstNonDummyTrack.discId}/cover`;
                    setCoverUrl(coverUrl);
                }
            } else {
                addMessage("error", "播放列表封面无可用音频仓库");
            }
        })();
    }, [playlist, allCredentials, albumId, discId, songs, addMessage]);
    if (!playlist) {
        return null;
    }
    return <div className={styles.playlistCoverContainer}>
        {!!coverUrl && (
            <Cover coverUrl={coverUrl} />
        )}
    </div>;
};

export default PlaylistCover;
