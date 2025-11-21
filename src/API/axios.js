import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach access token on every request
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access_token");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If request failed with 401 and NOT already retried
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return Promise.reject(error);

      try {
        // Call your custom refresh API
        const res = await axios.post(
          "http://127.0.0.1:8000/api/user/token/refresh/",
          { refresh },
          { headers: { "Content-Type": "application/json" } }
        );

        // Extract new access token
        const newAccess = res.data.access;
        const sameRefresh = res.data.refresh;

        // Save them
        localStorage.setItem("access_token", newAccess);
        localStorage.setItem("refresh_token", sameRefresh);

        // Retry original request with new access token
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);

      } catch (err) {
        console.error("❌ Refresh failed:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
