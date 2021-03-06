import React, { useState, useCallback, memo, useMemo } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
    PlaylistAdd,
    PlaylistRemove,
    Favorite,
    FavoriteBorder,
    MoreHoriz,
} from "@mui/icons-material";
import Tooltip from '@/components/LazyTooltip';
import { PlayQueueItem } from "@/types/common";
import { TrackListFeatures, AdvancedFeatures } from "../types";
import PlaylistAddDialog from "./PlaylistAddDialog";

interface Props {
    features: TrackListFeatures[];
    resourceUnavailable: boolean;
    isFavored: boolean;
    track: PlayQueueItem;
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
        track,
        onPlayQueueAdd,
        onPlayQueueRemove,
        onPlayQueueAddToLater,
        onClickFavoriteButton,
    } = props;
    const [isShowPlaylistAddDialog, setIsShowPlaylistAddDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
    const [isShowMoreActionsMenu, setIsShowMoreActionsMenu] = useState(false);
    const menuAnchorOrigin = useMemo(() => ({
        vertical: "bottom",
        horizontal: "center",
    } as const), [])
    const menuTransformOrigin = useMemo(() => ({
        vertical: "top",
        horizontal: "center",
    } as const), []);
    const onClickMoreActionsButton = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        setIsShowMoreActionsMenu(true);
    }, []);
    const closeMoreActionsMenu = useCallback(() => {
        setIsShowMoreActionsMenu(false);
    }, []);
    const onPlaylistAddDialogCancelOrAdded = useCallback(() => {
        setIsShowPlaylistAddDialog(false);
    }, []);
    return (
        <>
            {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_ADD_ICON) && (
                <Tooltip title="???????????????????????????">
                    <IconButton
                        onClick={onPlayQueueAdd}
                        disabled={resourceUnavailable}
                    >
                        <PlaylistAdd />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON) && (
                <Tooltip title="?????????????????????">
                    <IconButton
                        onClick={onPlayQueueRemove}
                        disabled={resourceUnavailable}
                    >
                        <PlaylistRemove />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && !isFavored && (
                <Tooltip title="????????????">
                    <IconButton onClick={onClickFavoriteButton}>
                        <FavoriteBorder />
                    </IconButton>
                </Tooltip>
            )}
            {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && isFavored && (
                <Tooltip title="????????????">
                    <IconButton onClick={onClickFavoriteButton}>
                        <Favorite />
                    </IconButton>
                </Tooltip>
            )}
            {features.some((feature) => AdvancedFeatures.includes(feature)) && (
                <Tooltip title="??????">
                    <IconButton onClick={onClickMoreActionsButton}>
                        <MoreHoriz />
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                anchorEl={anchorEl}
                open={isShowMoreActionsMenu}
                onClose={closeMoreActionsMenu}
                anchorOrigin={menuAnchorOrigin}
                transformOrigin={menuTransformOrigin}
            >
                {features.includes(TrackListFeatures.SHOW_ADD_TO_LATER) && (
                    <MenuItem
                        dense
                        onClick={() => {
                            onPlayQueueAddToLater();
                            setIsShowMoreActionsMenu(false);
                        }}
                    >
                        ????????????
                    </MenuItem>
                )}
                {features.includes(TrackListFeatures.SHOW_ADD_TO_PLAYLIST) && (
                    <MenuItem
                        dense
                        onClick={() => {
                            setIsShowMoreActionsMenu(false);
                            setIsShowPlaylistAddDialog(true);
                        }}
                    >
                        ?????????????????????
                    </MenuItem>
                )}
            </Menu>
            <PlaylistAddDialog
                open={isShowPlaylistAddDialog}
                track={track}
                onCancel={onPlaylistAddDialogCancelOrAdded}
                onAdded={onPlaylistAddDialogCancelOrAdded}
            />
        </>
    );
};

export default memo(ItemActions);
