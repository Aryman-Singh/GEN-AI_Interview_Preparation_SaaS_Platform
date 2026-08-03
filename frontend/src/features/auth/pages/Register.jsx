import React, { useState } from 'react'
import "../auth.form.scss"
import {useNavigate,Link} from "react-router"
import useAuth from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const{loading, handleRegister} = useAuth();
  
  
  const handleSubmit=async (e)=>{
     e.preventDefault();
     await handleRegister({name, email, password});
     navigate("/")
   }

   if(loading) {
     return <main><div><h1>Loading...</h1></div></main>
   }

  return (
     <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
           <div className='input-group'>
            <label htmlFor="name">Username</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
           </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button className="button button-primary" type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register