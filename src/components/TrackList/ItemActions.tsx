import React, { useState, useCallback } from "react";
import { IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import {
    PlaylistAdd,
    PlaylistRemove,
    Favorite,
    FavoriteBorder,
    MoreHoriz,
} from "@mui/icons-material";
import { TrackListFeatures } from "./types";

interface Props {
    features: TrackListFeatures[];
    resourceUnavailable: boolean;
    isFavored: boolean;
    onPlayQueueAdd: () => void;
    onPlayQueueRemove: () => void;
    onPlayQueueAddToLater: () => void;
    onClickFavoriteButton: () => void;
}

const ItemActions: React.FC<Props> = (props) => {
    const {
        features,
        resourceUnavailable,
        isFavored,
        onPlayQueueAdd,
        onPlayQueueRemove,
        onPlayQueueAddToLater,
        onClickFavoriteButton,
    } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
    const [isShowMoreActionsMenu, setIsShowMoreActionsMenu] = useState(false);
    const onClickMoreActionsButton = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        setIsShowMoreActionsMenu(true);
    }, []);
    return (
        <>
            {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_ADD_ICON) && (
                <Tooltip title="添加到当前播放队列">
                    <IconButton
                        onClick={() => {
                            onPlayQueueAdd();
                        }}
                        disabled={resourceUnavailable}
                    >
                        <PlaylistAdd />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON) && (
                <Tooltip title="从播放队列移除">
                    <IconButton
                        onClick={() => {
                            onPlayQueueRemove();
                        }}
                        disabled={resourceUnavailable}
                    >
                        <PlaylistRemove />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && !isFavored && (
                <Tooltip title="添加喜欢">
                    <IconButton onClick={onClickFavoriteButton}>
                        <FavoriteBorder />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && isFavored && (
                <Tooltip title="取消喜欢">
                    <IconButton onClick={onClickFavoriteButton}>
                        <Favorite />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_ADD_TO_LATER) && (
                <Tooltip title="更多">
                    <IconButton onClick={onClickMoreActionsButton}>
                        <MoreHoriz />
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                anchorEl={anchorEl}
                open={isShowMoreActionsMenu}
                onClose={() => {
                    setIsShowMoreActionsMenu(false);
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                {features.includes(TrackListFeatures.SHOW_ADD_TO_LATER) && (
                    <MenuItem
                        dense
                        onClick={() => {
                            onPlayQueueAddToLater();
                            setIsShowMoreActionsMenu(false);
                        }}
                    >
                        稍后播放
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default ItemActions;
