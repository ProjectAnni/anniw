import React from "react";
import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import { ParsedTag } from "@/utils/helper";

const TagType = {
    animation: "动画",
    artist: "艺术家",
    category: "分类",
    default: "默认",
    game: "游戏",
    group: "组合",
    organization: "组织",
    project: "企划",
    series: "系列",
};

interface TagProps {
    tag: string | ParsedTag;
}

const Tag = (props: TagProps) => {
    const { tag } = props;
    const navigate = useNavigate();
    const onClick = () => {
        if (typeof tag === "string") {
            navigate("/tag/" + encodeURI(tag));
        } else {
            navigate("/tag/" + encodeURI(`${tag.type}:${tag.name}`));
        }
    };
    if (typeof tag === "string") {
        return (
            <div className={styles.tag} onClick={onClick}>
                {tag}
            </div>
        );
    } else {
        return (
            <div className={styles.tag} onClick={onClick}>
                {tag.type !== "default" ? `${TagType[tag.type]}: ` : ""}
                {tag.name}
            </div>
        );
    }
};

export default Tag;
