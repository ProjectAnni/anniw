import React from "react";
import { useHistory } from "react-router";
import styles from "./index.module.scss";

interface TagProps {
    tag: string;
}

const Tag = (props: TagProps) => {
    let { tag } = props;
    const history = useHistory();
    const onClick = () => {
        history.push("/tag/" + encodeURI(tag));
    };
    return (
        <div className={styles.tag} onClick={onClick}>
            {tag}
        </div>
    );
};

export default Tag;
