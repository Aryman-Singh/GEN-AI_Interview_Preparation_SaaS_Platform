import { createContext, useState,useEffect } from "react";
import { getMe } from "./services/auth.api";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // production me true kar sakte ho

  useEffect(() => {
    const getAndSetUser = async () => {
      
      try {
        const data = await getMe();
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;