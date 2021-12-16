export interface LibraryInfoResponse {
    /** 服务端版本描述 */
    version: string;
    /** 服务端运行的 Annil 音频仓库协议版本 */
    protocolVersion: string;
    /** 服务端最近一次数据更新时间 */
    lastUpdate: number;
}
