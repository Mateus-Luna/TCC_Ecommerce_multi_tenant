import axios from "axios";

export const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL,

});

api.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token");

    const tenantId =
        localStorage.getItem("tenantId");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    if (tenantId) {

        config.headers["x-tenant-id"] =
            tenantId;

    }

    return config;

});