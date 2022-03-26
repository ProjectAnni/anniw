import React, { useMemo } from "react";
import { ListItem, IconButton, ListItemText } from "@mui/material";
import { Delete as DeleteIcon, Sync as SyncIcon } from "@mui/icons-material";
import { AnnilToken } from "@/types/common";
import { AnnilTokenLocalInfo } from "../../types";
import useRequest from "@/hooks/useRequest";
import { getLibraryInfo } from "../../services";

interface Props {
    library: AnnilToken & AnnilTokenLocalInfo;
    onSync: (library: AnnilToken & AnnilTokenLocalInfo) => void;
    onClick: (library: AnnilToken & AnnilTokenLocalInfo) => void;
    onDelete: (library: AnnilToken & AnnilTokenLocalInfo) => void;
}

const LibraryListItem: React.FC<Props> = (props) => {
    const { library, onClick, onSync, onDelete } = props;
    const [libraryInfo, loadingLibraryInfo] = useRequest(() => getLibraryInfo(library));
    const hasUpdate = useMemo(() => {
        if (!libraryInfo || loadingLibraryInfo || !libraryInfo.lastUpdate) {
            return false;
        }
        if (!library.lastSync) {
            return true;
        }
        return new Date(libraryInfo.lastUpdate * 1000).valueOf() > library.lastSync.valueOf();
    }, [library.lastSync, libraryInfo, loadingLibraryInfo]);
    return (
        <ListItem
            button
            key={library.id}
            onClick={() => {
                onClick(library);
            }}
            secondaryAction={
                <>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onSync(library);
                        }}
                    >
                        <SyncIcon />
                    </IconButton>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(library);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemText
                primary={library.name}
                secondary={`${library.url}${
                    library.lastSync
                        ? ` / 上次同步时间：${library.lastSync.toISOString()}`
                        : " / 从未同步"
                }${
                    library.serverLastUpdate
                        ? ` / 服务器更新时间：${library.serverLastUpdate.toISOString()}`
                        : ""
                }${library.albumCount ? ` / ${library.albumCount} Albums` : ""}${
                    hasUpdate ? " / 有更新" : ""
                }`}
            />
        </ListItem>
    );
};

export default LibraryListItem;
