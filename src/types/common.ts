export enum LoginStatus {
    UNKNOWN,
    LOGGED_IN,
    LOGGED_OUT,
}

export interface Indexable {
    id: string;
}

export interface MusicIndex {
    albumId: string;
    track: number;
}

export interface SiteInfo {
    siteName: string;
    description: string;
    protocolVersion: string;
    features: string[];
}

export interface AnnilToken {
    id: string;
    /** Annil 名称 */
    name: string;
    /** Annil 站点地址 */
    url: string;
    /** Annil Token 内容 */
    token: string;
    /** 客户端尝试访问时的优先级 */
    priority: number;
}

export interface UserInfo {
    userId: string;
    username: string;
    email: string;
    nickname: string;
    avatar: string;
}
