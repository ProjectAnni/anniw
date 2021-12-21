import React, { useState, useEffect, useMemo } from "react";
import { List, ListItemText, ListItem, Box, IconButton } from "@mui/material";
import { Delete as DeleteIcon, Sync as SyncIcon } from "@mui/icons-material";
import { default as LibraryDB } from "@/db/library";
import { AnnilToken } from "@/types/common";
interface Props {
    libraries: AnnilToken[];
    localInfoRefreshIndicator: number;
    onClick: (library: AnnilToken) => void;
    onSync: (library: AnnilToken) => void;
    onDelete: (library: AnnilToken) => void;
}

interface AnnilTokenLocalInfo {
    lastSync?: Date;
    albumCount?: number;
    serverLastUpdate?: Date;
}

const LibraryList: React.FC<Props> = (props) => {
    const { libraries, localInfoRefreshIndicator, onClick, onDelete, onSync } = props;
    const [localLibraryInfo, setLocalLibraryInfo] = useState<
        (AnnilToken & AnnilTokenLocalInfo)[] | null
    >(null);
    const librariesWithLocalInfo = useMemo<(AnnilToken & AnnilTokenLocalInfo)[]>(() => {
        if (!libraries?.length) {
            return [];
        }
        if (!localLibraryInfo) {
            return libraries;
        }

        return localLibraryInfo;
    }, [libraries, localLibraryInfo]);
    useEffect(() => {
        (async () => {
            if (!libraries?.length) {
                return;
            }
            const result: (AnnilToken & AnnilTokenLocalInfo)[] = [];
            for (const library of libraries) {
                const localLibraryInfo = await LibraryDB.get(library.url);
                result.push(localLibraryInfo ? { ...library, ...localLibraryInfo } : library);
            }
            setLocalLibraryInfo(result);
        })();
    }, [libraries, localInfoRefreshIndicator]);
    if (!librariesWithLocalInfo?.length) {
        return null;
    }
    return (
        <Box>
            <List>
                {librariesWithLocalInfo.map((library) => {
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
                                        : ""
                                }${
                                    library.serverLastUpdate
                                        ? ` / 服务器更新时间：${library.serverLastUpdate.toISOString()}`
                                        : ""
                                }${library.albumCount ? ` / ${library.albumCount} Discs` : ""}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default LibraryList;
