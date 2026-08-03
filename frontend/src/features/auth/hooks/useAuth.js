import { useContext, useEffect } from "react";
import {AuthContext} from "../auth.context";
import { register,login,logout,getMe } from "../services/auth.api";
 const useAuth = () => {
  const context = useContext(AuthContext);
  const{user, setUser, loading, setLoading} = context;
   
  const handleLogin=async({email, password}) => {
    setLoading(true);
    try {
      const data = await login({email, password});
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister=async({username, email, password}) => {
    setLoading(true);
    try {
      const data = await register({username, email, password});
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

const handleLogout=async() => {
  setLoading(true);
  try {
    await logout();
    setUser(null);
    setLoading(false);
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const getAndSetUser = async()=>{
  try{
    const data = await getMe()
    setUser(data.user)
  } catch (error) {
    console.error("Failed to fetch user:", error);
  } finally {
    setLoading(false)
  }
  }
  getAndSetUser()

   
}, [])


 return {user, setUser, loading, handleLogin, handleRegister, handleLogout};
}

export default useAuth;