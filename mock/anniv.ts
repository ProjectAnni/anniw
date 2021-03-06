import { MockMethod } from "vite-plugin-mock";
import { userMocks } from "./user";
import { credentialsMocks } from "./credentials";

export default [
    {
        url: "/api/info",
        method: "get",
        response: () => {
            return {
                status: 0,
                data: {
                    site_name: "某昨的音乐小屋",
                    description: "摸了 摸了",
                    protocol_version: "1",
                    features: ["2fa", "invite"],
                },
            };
        },
    },
    ...userMocks,
    ...credentialsMocks,
] as MockMethod[];
