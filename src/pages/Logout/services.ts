import request from "@/api/request";

export function logout() {
    return request.post("/api/user/logout");
}
