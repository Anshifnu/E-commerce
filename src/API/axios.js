import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return Promise.reject(error);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/user/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;
        const newRefresh = res.data.refresh;

        localStorage.setItem("access_token", newAccess);
        localStorage.setItem("refresh_token", newRefresh);

        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
