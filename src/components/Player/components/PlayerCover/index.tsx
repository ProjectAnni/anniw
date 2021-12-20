import React from "react";
import { useRecoilValue } from "recoil";
import { NowPlayingInfoState } from "@/state/player";
import Cover from '@/components/Cover';
import styles from './index.module.scss';

const PlayerCover: React.FC = () => {
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const { coverUrl } = nowPlayingInfo;
    return (
        <div className={styles.coverContainer}><Cover coverUrl={coverUrl} /></div> 
    )
}

export default PlayerCover;