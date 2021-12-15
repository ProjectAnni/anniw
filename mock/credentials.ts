export const credentialsMocks = [
    {
        url: "/api/credential",
        method: "get",
        response: () => {
            return {
                status: 0,
                data: [
                    {
                        id: "c002a816-7aa2-48e7-8281-c8c44c574dbd",
                        name: "Test Library",
                        url: "https://annil.mmf.moe",
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjAsInR5cGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiYWxsb3dTaGFyZSI6dHJ1ZX0.7CH27OBvUnJhKxBdtZbJSXA-JIwQ4MWqI5JsZ46NoKk",
                        priority: 1,
                    },
                ],
            };
        },
    },
    {
        url: "/api/credential",
        method: "delete",
        response: () => {
            return {
                status: 0,
            };
        },
    },
];
