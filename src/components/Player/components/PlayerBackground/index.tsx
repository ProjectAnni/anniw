import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import useLocalStorageValue from "@/hooks/useLocalStorageValue";
import { PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

const PlayerBackground: React.FC = () => {
    const [playerStatus] = useRecoilState(PlayerStatusState);
    const [onPageCloseAction] = useLocalStorageValue("player.pageOnCloseAction", "none");
    useEffect(() => {
        window.onbeforeunload =
            onPageCloseAction === "confirmWhenPlaying" && playerStatus === PlayerStatus.PLAYING
                ? (e: BeforeUnloadEvent) => {
                      e.preventDefault();
                      return "播放中，确定要退出吗"; // 这句话好像不会显示
                  }
                : null;
    }, [onPageCloseAction, playerStatus]);
    return null;
};

export default PlayerBackground;
