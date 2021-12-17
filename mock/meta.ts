export default [
    {
        url: "/api/meta/album",
        method: "get",
        response: ({ query }) => {
            const { "id[]": id } = query;
            return {
                status: 0,
                data: {
                    [id]: {
                        albumId: id,
                        title: id,
                        artist: "artist",
                    },
                },
            };
        },
    },
];
