import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../API/axios";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);



  useEffect(() => {
    const restoreSession = async () => {
      try {
        const access = localStorage.getItem("access_token");
        if (access) {
          const payload = jwtDecode(access);
          const userData = {
            user_id: payload.user_id,
            name: payload.username,
            email: payload.email,
            role:payload.role,
            isBlock:payload.isBlock
            
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Session restore failed:", err);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      } finally {
        setLoadingUser(false);
      }
    };
    restoreSession();
  }, []);



const login = async (email, password) => {
  try {
    const res = await api.post("user/login/", { email, password });
    const { access, refresh } = res.data;

    if (!access) throw new Error("No access token received");

    // Decode the access token FIRST
    const payload = jwtDecode(access);

    // Create userData BEFORE checking
    const userData = {
      name: payload.username,
      email: payload.email,
      user_id: payload.user_id,
      role: payload.role,
      isBlock: payload.isBlock,
    };

    // 🚫 If user is blocked → logout & stop login
    if (userData.isBlock === true) {
      console.warn("⛔ Blocked user attempted login");
      
      
      return { success: false, error: "Your account is blocked" };
    }

    // Otherwise continue normal login
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return { success: true, user: userData };

  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    return { success: false, error: "Invalid email or password" };
  }
};


  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      await api.post("user/logout/", { refresh });
    } catch (err) {
      console.warn("Logout API failed:", err);
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loadingUser,setLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
