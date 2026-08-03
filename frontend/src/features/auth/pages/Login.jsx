import React, { useState } from 'react'
import "../auth.form.scss"
import{Link} from "react-router"
import useAuth from "../hooks/useAuth"
import { useNavigate } from 'react-router'

const Login = () => {
  const {loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit=async (e)=>{
     e.preventDefault();
     handleLogin({email, password})
     navigate("/")
   }

   if(loading) {
     return <main><div><h1>Loading...</h1></div></main>
   }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button className="button button-primary" type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login