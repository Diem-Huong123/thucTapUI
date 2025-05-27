const BASE_URL = "http://localhost:8089";

export const APIConnect = {
    connectSSH: async ({ host, user, password }) => {
        const query = new URLSearchParams({ host, user, password }).toString();
        const res = await fetch(`${BASE_URL}/ssh/connect?${query}`, { method: "POST" });
        const text = await res.text();
        return { success: res.ok, message: text };
    },
};
