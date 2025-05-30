const BASE_URL = "http://localhost:8089";

export const APIConnect = {
    connectSSH: async ({ host, user, password }) => {
        const query = new URLSearchParams({ host, user, password }).toString();
        const res = await fetch(`${BASE_URL}/ssh/connect?${query}`, { method: "POST" });
        const text = await res.text();
        return { success: res.ok, message: text };
    },

    disconnectSSH: async ({ host, user }) => {
        const query = new URLSearchParams({ host, user }).toString();
        const res = await fetch(`${BASE_URL}/ssh/disconnect?${query}`, { method: "POST" });
        const text = await res.text();
        return { success: res.ok, message: text };
    },

    getServers: async () => {
        const res = await fetch(`${BASE_URL}/api/servers`);
        const data = await res.json();
        return data;
    },

    addServer: async (payload) => {
        const res = await fetch(`${BASE_URL}/api/servers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    updateServer: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/api/servers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    deleteServer: async (id) => {
        const res = await fetch(`${BASE_URL}/api/servers/${id}`, { method: 'DELETE' });
        return res.json();
    },


};
