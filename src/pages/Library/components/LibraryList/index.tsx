import React from "react";
import { List, ListItemText, ListItem, Box, IconButton } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { AnnilToken } from "@/types/common";

interface Props {
    libraries: AnnilToken[];
    onClick: (library: AnnilToken) => void;
    onDelete: (library: AnnilToken) => void;
}

const LibraryList: React.FC<Props> = (props) => {
    const { libraries, onClick, onDelete } = props;
    if (!libraries?.length) {
        return null;
    }
    return (
        <Box>
            <List>
                {libraries.map((library) => {
                    return (
                        <ListItem
                            button
                            key={library.id}
                            onClick={() => {
                                onClick(library);
                            }}
                            secondaryAction={
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(library);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={library.name} secondary={library.url} />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default LibraryList;
