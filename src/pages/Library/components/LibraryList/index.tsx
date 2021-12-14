import React from "react";
import { List, ListItemText, ListItem, Box, IconButton } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { AnnilToken } from "@/types/common";

interface Props {
    libraries: AnnilToken[];
    handleDelete: (library: AnnilToken) => void;
}

const LibraryList: React.FC<Props> = (props) => {
    const { libraries, handleDelete } = props;
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
                            secondaryAction={
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(library);
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
