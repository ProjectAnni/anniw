import React from "react";
import { useNavigate } from "react-router";
import styles from "./index.module.scss";

interface TagProps {
    tag: string;
}

const Tag = (props: TagProps) => {
    const { tag } = props;
    const navigate = useNavigate();
    const onClick = () => {
        navigate("/tag/" + encodeURI(tag));
    };
    return (
        <div className={styles.tag} onClick={onClick}>
            {tag}
        </div>
    );
};

export default Tag;
