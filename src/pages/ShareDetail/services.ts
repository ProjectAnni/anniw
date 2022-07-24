import request from "@/api/request";
import { ExportedPlaylist } from "@/types/exported";

export async function getShare(id: string) {
    const [formatted, original] = await Promise.all([
        request.get<ExportedPlaylist>("/api/share", { id }),
        request.get<ExportedPlaylist>("/api/share", { id }, { formatResponse: false }),
    ]);
    const res = formatted;
    res.metadata = original.metadata;
    return res;
}
